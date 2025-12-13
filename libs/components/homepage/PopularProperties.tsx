import React, { useState, ChangeEvent, useEffect } from 'react';
import { Stack, Box, Pagination } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination as SwiperPagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularPropertyCard from './PopularPropertyCard';
import AnimatedListItem from '../common/AnimatedListItem';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { PropertiesInquiry } from '../../types/property/property.input';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';

interface PopularPropertiesProps {
	initialInput: PropertiesInquiry;
}

const PopularProperties = (props: PopularPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularProperties, setPopularProperties] = useState<Property[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>({
		...initialInput,
		limit: device === 'mobile' ? 4 : initialInput.limit,
	});

	/** APOLLO REQUESTS **/

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPopularProperties(data?.getProperties?.list);
			setTotal(data?.getProperties?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		if (device === 'mobile') {
			setSearchFilter({
				...initialInput,
				limit: 4,
				page: 1,
			});
			setCurrentPage(1);
		}
	}, [device, initialInput]);

	/** HANDLERS **/

	const paginationHandler = (event: ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (!popularProperties) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular properties</span>
					</Stack>
					<Stack className={'card-box'}>
						<Box className={'popular-property-grid'}>
							{popularProperties.map((property: Property, index: number) => {
								return (
									<Box key={property._id} className={'popular-property-item'}>
										<AnimatedListItem index={index}>
										<PopularPropertyCard property={property} />
										</AnimatedListItem>
									</Box>
								);
							})}
						</Box>
					</Stack>
					{total > 4 && (
						<Stack className={'pagination-box'}>
							<Pagination
								count={Math.ceil(total / 4)}
								page={currentPage}
								onChange={paginationHandler}
								shape="circular"
								color="primary"
							/>
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular properties</span>
							<p>Popularity is based on views</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/property'}>
									<span>See All Categories</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, SwiperPagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
						>
							{popularProperties.map((property: Property, index: number) => {
								return (
									<SwiperSlide key={property._id} className={'popular-property-slide'}>
										<AnimatedListItem index={index}>
										<PopularPropertyCard property={property} />
										</AnimatedListItem>
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'propertyViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProperties;
