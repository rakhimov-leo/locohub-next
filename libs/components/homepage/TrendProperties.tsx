import React, { useState, ChangeEvent, useEffect } from 'react';
import { Stack, Box, Pagination } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination as SwiperPagination } from 'swiper';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import TrendPropertyCard from './TrendPropertyCard';
import AnimatedListItem from '../common/AnimatedListItem';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useQuery, useMutation } from '@apollo/client';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TrendPropertiesProps {
	initialInput: PropertiesInquiry;
}

const TrendProperties = (props: TrendPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProperties, setTrendProperties] = useState<Property[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>({
		...initialInput,
		limit: device === 'mobile' ? 4 : initialInput.limit,
	});

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

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
			setTrendProperties(data?.getProperties?.list);
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

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			//execute likePropertyHandler Mutation
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({
				variables: { input: id },
			});
			//execute getPropertiesRefetch
			await getPropertiesRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error:likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const paginationHandler = (event: ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (trendProperties) console.log('trendProperties:', trendProperties);
	if (!trendProperties) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Hotels</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendProperties.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Box className={'trend-property-grid'}>
								{trendProperties.map((property: Property, index: number) => {
									return (
										<Box key={property._id} className={'trend-property-item'}>
											<AnimatedListItem index={index}>
											<TrendPropertyCard property={property} likePropertyHandler={likePropertyHandler} />
											</AnimatedListItem>
										</Box>
									);
								})}
							</Box>
						)}
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
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Hotels</span>
							<p>Trend is based on likes</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendProperties.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								spaceBetween={15}
								modules={[Autoplay, Navigation, SwiperPagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
							>
								{trendProperties.map((property: Property, index: number) => {
									return (
										<SwiperSlide key={property._id} className={'trend-property-slide'}>
											<AnimatedListItem index={index}>
											<TrendPropertyCard property={property} likePropertyHandler={likePropertyHandler} />
											</AnimatedListItem>
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'propertyLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProperties;
