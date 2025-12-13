import React, { useState, ChangeEvent, useEffect } from 'react';
import { Stack, Box, Pagination } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination as SwiperPagination } from 'swiper';
import TopPropertyCard from './TopPropertyCard';
import AnimatedTopPropertyCard from './AnimatedTopPropertyCard';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Property } from '../../types/property/property';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TopPropertiesProps {
	initialInput: PropertiesInquiry;
}

const TopProperties = (props: TopPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topProperties, setTopProperties] = useState<Property[]>([]);
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
			setTopProperties(data?.getProperties?.list);
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

	if (device === 'mobile') {
		return (
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top buildings</span>
					</Stack>
					<Stack className={'card-box'}>
						<Box className={'top-property-grid'}>
							{topProperties.map((property: Property, index: number) => {
								return (
									<Box className={'top-property-item'} key={property?._id}>
										<AnimatedTopPropertyCard
											property={property}
											index={index}
											likePropertyHandler={likePropertyHandler}
										/>
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
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top buildings</span>
							<p>Check out our Top Buildings</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-top-prev'} />
								<div className={'swiper-top-pagination'}></div>
								<EastIcon className={'swiper-top-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay, Navigation, SwiperPagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
							pagination={{
								el: '.swiper-top-pagination',
							}}
						>
							{topProperties.map((property: Property, index: number) => {
								return (
									<SwiperSlide className={'top-property-slide'} key={property?._id}>
										<AnimatedTopPropertyCard
											property={property}
											index={index}
											likePropertyHandler={likePropertyHandler}
										/>
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'propertyRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopProperties;
