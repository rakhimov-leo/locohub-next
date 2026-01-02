import React, { useState, ChangeEvent, useEffect } from 'react';
import { Stack, Box, Pagination, Typography, IconButton, Divider } from '@mui/material';
import Image from 'next/image';
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
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

interface TopPropertiesProps {
	initialInput: PropertiesInquiry;
}

const TopProperties = (props: TopPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
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

	const pushDetailHandler = async (propertyId: string) => {
		if (!propertyId || propertyId.trim() === '') {
			console.error('[TopProperties] Invalid propertyId:', propertyId);
			return;
		}
		if (typeof window !== 'undefined') {
			try {
				const currentPath = window.location.pathname;
				if (currentPath === '/' || currentPath.startsWith('/?')) {
					const scrollY =
						window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
					sessionStorage.setItem('homepageScrollPosition', scrollY.toString());
					sessionStorage.setItem('fromDetailPage', 'true');
				}
			} catch (err) {
				console.warn('[TopProperties] sessionStorage error:', err);
			}
		}
		await router.push({ pathname: '/property/detail', query: { id: propertyId } }, undefined, { scroll: false });
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top buildings</span>
					</Stack>
					<Stack className={'card-box'}>
						<Box component={'div'} className={'top-property-grid'}>
							{topProperties.map((property: Property, index: number) => {
								return (
									<Box component={'div'} className={'top-property-item'} key={property?._id}>
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
		const heroProperty = topProperties && topProperties.length > 0 ? topProperties[0] : null;
		const smallProperties = topProperties && topProperties.length > 1 ? topProperties.slice(1, 5) : [];

		return (
			<Stack className={'top-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top hotels</span>
							<p>Check out our Top Hotels</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{heroProperty && heroProperty.propertyImages && heroProperty.propertyImages.length > 0 && (
							<Box component={'div'} className={'top-property-hero'}>
								<Box
									component={'div'}
									className={'top-property-hero-image'}
									onClick={() => {
										if (heroProperty?._id) {
											pushDetailHandler(heroProperty._id);
										}
									}}
									style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
								>
									<Image
										src={`${REACT_APP_API_URL}/${heroProperty.propertyImages[0]}`}
										alt={heroProperty.propertyTitle}
										fill
										loading="lazy"
										style={{ objectFit: 'cover' }}
										unoptimized
									/>
									<Box component={'div'} className={'top-property-hero-info'}>
										<Typography
											className={'top-property-hero-title'}
											onClick={() => {
												if (heroProperty?._id) {
													pushDetailHandler(heroProperty._id);
												}
											}}
										>
											{heroProperty?.propertyTitle}
										</Typography>
										<Typography className={'top-property-hero-address'}>{heroProperty?.propertyAddress}</Typography>
										<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
											<Stack direction="row" spacing={0.3}>
												{[...Array(4)].map((_, idx) => (
													<StarRoundedIcon key={idx} sx={{ fontSize: 18, color: '#fbbf24' }} />
												))}
											</Stack>
											<div
												style={{
													marginLeft: '4px',
													paddingLeft: '6.4px',
													paddingRight: '6.4px',
													paddingTop: '0.8px',
													paddingBottom: '0.8px',
													borderRadius: '6px',
													backgroundColor: '#2563eb',
												}}
											>
												<Typography sx={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>9.2/10</Typography>
											</div>
											<Typography sx={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.9)' }}>
												{(heroProperty?.propertyViews ?? 0).toLocaleString()} reviews
											</Typography>
										</Stack>
										<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
											<Typography sx={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>
												From ${heroProperty?.propertyPrice}
											</Typography>
											<Stack direction="row" alignItems="center" spacing={1}>
												<IconButton color={'default'} sx={{ color: '#ffffff' }}>
													<RemoveRedEyeIcon />
												</IconButton>
												<Typography sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.9)' }}>
													{heroProperty?.propertyViews}
												</Typography>
												<IconButton
													color={'default'}
													sx={{ color: '#ffffff' }}
													onClick={() => {
														if (user && heroProperty?._id) {
															likePropertyHandler(user, heroProperty._id);
														}
													}}
												>
													{heroProperty?.meLiked && heroProperty.meLiked.length > 0 && heroProperty.meLiked[0]?.myFavorite ? (
														<FavoriteIcon style={{ color: 'red' }} />
													) : (
														<FavoriteIcon />
													)}
												</IconButton>
												<Typography sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.9)' }}>
													{heroProperty?.propertyLikes}
												</Typography>
											</Stack>
										</Stack>
									</Box>
								</Box>
							</Box>
						)}
						{smallProperties.length > 0 && (
							<Box component={'div'} className={'top-property-small-grid'}>
								{smallProperties.map((property: Property, index: number) => {
									return (
										<Box component={'div'} className={'top-property-small-item'} key={property?._id}>
											<AnimatedTopPropertyCard
												property={property}
												index={index + 1}
												likePropertyHandler={likePropertyHandler}
											/>
										</Box>
									);
								})}
							</Box>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'propertyRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopProperties;
