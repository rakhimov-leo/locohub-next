import React, { useEffect, useState, ChangeEvent } from 'react';
import { NextPage } from 'next';
import { Box, Stack, Typography, Button, Link, TextField, IconButton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { GET_PROPERTY } from '../../apollo/user/query';
import { Property } from '../../libs/types/property/property';
import { REACT_APP_API_URL, Messages } from '../../libs/config';
import { formatterStr } from '../../libs/utils';
import BedIcon from '@mui/icons-material/Hotel';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PetsIcon from '@mui/icons-material/Pets';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightIcon from '@mui/icons-material/Flight';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { CREATE_COMMENT } from '../../apollo/user/mutation';
import { GET_COMMENTS } from '../../apollo/user/query';
import { userVar } from '../../apollo/store';
import { T } from '../../libs/types/common';
import { sweetErrorHandling } from '../../libs/sweetAlert';
import Review from '../../libs/components/property/Review';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	// Handle both string and array cases for Next.js router.query
	const rawId = router.isReady ? router.query.id : undefined;
	const rawPropertyId = Array.isArray(rawId) ? rawId[0] : rawId;
	// Ensure propertyId is a valid non-empty string
	const propertyId = rawPropertyId && String(rawPropertyId).trim() ? String(rawPropertyId).trim() : undefined;

	// Comment states
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>({
		page: 1,
		limit: 3, // Start with 3 comments
		search: {
			commentRefId: propertyId || '',
		},
	});
	const [propertyComments, setPropertyComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [displayedCommentsCount, setDisplayedCommentsCount] = useState<number>(3); // Track displayed comments
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.PROPERTY,
		commentContent: '',
		commentRefId: propertyId || '',
	});

	// Booking form states
	const [bookingType, setBookingType] = useState<'online' | 'inquiry'>('online');
	const [checkInDate, setCheckInDate] = useState<string>('');
	const [checkOutDate, setCheckOutDate] = useState<string>('');
	const [adultCount, setAdultCount] = useState<number>(1);
	const [childrenCount, setChildrenCount] = useState<number>(0);

	// Debug logging
	useEffect(() => {
		if (router.isReady) {
			console.log('[PropertyDetail] Router ready, propertyId:', propertyId);
			console.log('[PropertyDetail] Router query:', router.query);
			console.log('[PropertyDetail] Raw ID:', rawId);
		}
	}, [router.isReady, propertyId, router.query, rawId]);

	// Ensure propertyId is valid before making the query
	const isValidPropertyId = propertyId && propertyId.trim() !== '' && propertyId.length > 0;

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);

	const { data, loading, error } = useQuery<{ getProperty: Property }>(GET_PROPERTY, {
		variables: { input: propertyId || '' },
		skip: !router.isReady || !isValidPropertyId,
		fetchPolicy: 'network-only',
		errorPolicy: 'all',
		onError: (error) => {
			console.error('[PropertyDetail] Query error:', error);
			console.error('[PropertyDetail] Error details:', {
				graphQLErrors: error.graphQLErrors,
				networkError: error.networkError,
				propertyId: propertyId,
				isValidPropertyId: isValidPropertyId,
				variables: { input: propertyId || '' },
				operationName: 'GetProperty',
			});
			// Log the actual GraphQL error message
			if (error.graphQLErrors && error.graphQLErrors.length > 0) {
				error.graphQLErrors.forEach((gqlError, index) => {
					console.error(`[PropertyDetail] GraphQL Error ${index + 1}:`, {
						message: gqlError.message,
						locations: gqlError.locations,
						path: gqlError.path,
						extensions: gqlError.extensions,
					});
				});
			}
		},
		onCompleted: (data) => {
			console.log('[PropertyDetail] Query completed:', data);
			if (!data?.getProperty) {
				console.warn('[PropertyDetail] No property data returned for propertyId:', propertyId);
				console.warn('[PropertyDetail] Full response data:', data);
			} else {
				console.log('[PropertyDetail] Property found:', {
					_id: data.getProperty._id,
					title: data.getProperty.propertyTitle,
				});
			}
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId || !isValidPropertyId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			console.log('[PropertyDetail] Raw comments data:', JSON.stringify(data, null, 2));
			console.log('[PropertyDetail] commentInquiry:', commentInquiry);
			console.log('[PropertyDetail] getComments:', data?.getComments);
			console.log('[PropertyDetail] getComments.list:', data?.getComments?.list);
			console.log('[PropertyDetail] getComments.metaCounter:', data?.getComments?.metaCounter);
			const comments = data?.getComments?.list || [];
			const total = data?.getComments?.metaCounter?.[0]?.total ?? 0;
			setPropertyComments(comments);
			setCommentTotal(total);
			console.log('[PropertyDetail] Comments loaded:', { count: comments.length, total, comments });
		},
		onError: (error) => {
			console.error('[PropertyDetail] Comments query error:', error);
			console.error('[PropertyDetail] commentInquiry:', commentInquiry);
		},
	});

	const property = data?.getProperty;

	// Update comments from query data
	useEffect(() => {
		if (getCommentsData?.getComments) {
			console.log('[PropertyDetail] getCommentsData:', JSON.stringify(getCommentsData, null, 2));
			console.log('[PropertyDetail] getCommentsData.getComments:', getCommentsData.getComments);
			console.log('[PropertyDetail] getCommentsData.getComments.list:', getCommentsData.getComments.list);
			const comments = getCommentsData.getComments.list || [];
			const total = getCommentsData.getComments.metaCounter?.[0]?.total ?? 0;
			setPropertyComments(comments);
			setCommentTotal(total);
			console.log('[PropertyDetail] Comments updated from query data:', { count: comments.length, total, comments });
		} else {
			console.log('[PropertyDetail] No getCommentsData:', getCommentsData);
		}
	}, [getCommentsData]);

	useEffect(() => {
		// Always scroll to top when opening detail page
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0);
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		}
	}, [propertyId]);

	// Update comment inquiry when propertyId changes
	useEffect(() => {
		if (propertyId) {
			const newInquiry = {
				page: 1,
				limit: 3,
				search: {
					commentRefId: propertyId,
				},
			};
			console.log('[PropertyDetail] Setting commentInquiry:', newInquiry);
			setCommentInquiry(newInquiry);
			setInsertCommentData({
				...insertCommentData,
				commentRefId: propertyId,
			});
			setDisplayedCommentsCount(3); // Reset to 3 when property changes
		}
	}, [propertyId]);

	// Refetch comments when commentInquiry changes
	useEffect(() => {
		if (commentInquiry.search.commentRefId && isValidPropertyId) {
			console.log('[PropertyDetail] Refetching comments with inquiry:', JSON.stringify(commentInquiry, null, 2));
			getCommentsRefetch({ input: commentInquiry })
				.then((result) => {
					console.log('[PropertyDetail] Refetch result:', JSON.stringify(result, null, 2));
					if (result?.data) {
						console.log('[PropertyDetail] Refetch result.data:', JSON.stringify(result.data, null, 2));
						console.log(
							'[PropertyDetail] Refetch result.data.getComments:',
							JSON.stringify(result.data.getComments, null, 2),
						);
						console.log(
							'[PropertyDetail] Refetch result.data.getComments.list:',
							JSON.stringify(result.data.getComments?.list, null, 2),
						);
						const comments = result.data?.getComments?.list || [];
						const total = result.data?.getComments?.metaCounter?.[0]?.total ?? 0;
						setPropertyComments(comments);
						setCommentTotal(total);
						console.log('[PropertyDetail] Comments refetched:', { count: comments.length, total, comments });
					} else {
						console.log('[PropertyDetail] Refetch result has no data:', result);
					}
				})
				.catch((err) => {
					console.error('[PropertyDetail] Error refetching comments:', err);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [commentInquiry.limit, commentInquiry.search.commentRefId]);

	/** HANDLERS **/
	const loadMoreCommentsHandler = async () => {
		const newLimit = displayedCommentsCount + 5;
		setDisplayedCommentsCount(newLimit);
		setCommentInquiry({ ...commentInquiry, limit: newLimit });
	};

	const createCommentHandler = async () => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!propertyId) throw new Error('Property ID is missing');

			await createComment({
				variables: {
					input: insertCommentData,
				},
			});
			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			// After adding new comment, refresh comments to show the new one
			console.log(
				'[PropertyDetail] Refreshing comments after new comment with inquiry:',
				JSON.stringify(commentInquiry, null, 2),
			);
			const result = await getCommentsRefetch({ input: commentInquiry });
			console.log('[PropertyDetail] Refresh result:', JSON.stringify(result, null, 2));
			if (result?.data) {
				console.log('[PropertyDetail] Refresh result.data:', JSON.stringify(result.data, null, 2));
				console.log(
					'[PropertyDetail] Refresh result.data.getComments:',
					JSON.stringify(result.data.getComments, null, 2),
				);
				console.log(
					'[PropertyDetail] Refresh result.data.getComments.list:',
					JSON.stringify(result.data.getComments?.list, null, 2),
				);
				const comments = result.data?.getComments?.list || [];
				const total = result.data?.getComments?.metaCounter?.[0]?.total ?? 0;
				setPropertyComments(comments);
				setCommentTotal(total);
				console.log('[PropertyDetail] Comments refreshed after new comment:', {
					count: comments.length,
					total,
					comments,
				});
			} else {
				console.log('[PropertyDetail] Refresh result has no data:', result);
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	if (!router.isReady) {
		return (
			<Stack id="property-detail-page" alignItems="center" justifyContent="center" minHeight="50vh">
				<Typography>Loading...</Typography>
			</Stack>
		);
	}

	if (!propertyId) {
		return (
			<Stack id="property-detail-page" alignItems="center" justifyContent="center" minHeight="50vh">
				<Typography>Hotel ID is missing.</Typography>
				<Button
					variant="text"
					startIcon={<ArrowBackIcon />}
					onClick={() => router.back()}
					sx={{ mt: 2, textTransform: 'none' }}
				>
					Back
				</Button>
			</Stack>
		);
	}

	if (loading && !property) {
		return (
			<Stack id="property-detail-page" alignItems="center" justifyContent="center" minHeight="50vh">
				<Typography>Loading hotel details...</Typography>
			</Stack>
		);
	}

	// Check for GraphQL errors
	if (error) {
		const errorMessage = error.graphQLErrors?.[0]?.message || error.message || 'An error occurred';
		const isNotFoundError = errorMessage.includes('No data found') || errorMessage.includes('not found');

		return (
			<Stack id="property-detail-page" alignItems="center" justifyContent="center" minHeight="50vh" spacing={2}>
				<Typography variant="h6" sx={{ fontWeight: 600 }}>
					{isNotFoundError ? 'Property Not Found' : 'Error Loading Property'}
				</Typography>
				<Typography variant="body2" sx={{ color: '#717171', textAlign: 'center', maxWidth: 400 }}>
					{isNotFoundError ? 'The property you are looking for does not exist or has been removed.' : errorMessage}
				</Typography>
				{propertyId && (
					<Typography variant="caption" sx={{ color: '#999', mt: 1 }}>
						Property ID: {propertyId}
					</Typography>
				)}
				<Button
					variant="contained"
					startIcon={<ArrowBackIcon />}
					onClick={() => router.back()}
					sx={{ mt: 2, textTransform: 'none' }}
				>
					Go Back
				</Button>
			</Stack>
		);
	}

	if (!property && !loading) {
		return (
			<Stack id="property-detail-page" alignItems="center" justifyContent="center" minHeight="50vh">
				<Typography>Hotel not found.</Typography>
				<Button
					variant="text"
					startIcon={<ArrowBackIcon />}
					onClick={() => router.back()}
					sx={{ mt: 2, textTransform: 'none' }}
				>
					Back
				</Button>
			</Stack>
		);
	}

	// TypeScript guard: ensure property is defined before rendering
	if (!property) {
		return (
			<Stack id="property-detail-page" alignItems="center" justifyContent="center" minHeight="50vh">
				<Typography>Loading hotel details...</Typography>
			</Stack>
		);
	}

	const imagePath: string = property.propertyImages?.[0]
		? `${REACT_APP_API_URL}/${property.propertyImages[0]}`
		: '/img/banner/header1.svg';

	const countryLabel = property.propertyLocation || 'this destination';

	// Get map coordinates for each country
	const getMapCoordinates = (location: string) => {
		const locationMap: { [key: string]: { lat: number; lng: number; zoom: number } } = {
			SEOUL: { lat: 37.5665, lng: 126.978, zoom: 11 },
			FRANCE: { lat: 46.6034, lng: 1.8883, zoom: 6 },
			SPAIN: { lat: 40.4637, lng: -3.7492, zoom: 6 },
			ITALY: { lat: 41.8719, lng: 12.5674, zoom: 6 },
			GERMANY: { lat: 51.1657, lng: 10.4515, zoom: 6 },
			USA: { lat: 37.0902, lng: -95.7129, zoom: 4 },
			UK: { lat: 55.3781, lng: -3.436, zoom: 6 },
		};
		return locationMap[location] || { lat: 0, lng: 0, zoom: 2 };
	};

	const mapCoords = getMapCoordinates(property.propertyLocation);

	if (device === 'mobile') {
		return (
			<Stack id="property-detail-page" sx={{ minHeight: '100vh', padding: '20px' }}>
				<div
					onClick={() => router.back()}
					style={{ cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
				>
					<ArrowBackIcon />
					<Typography>Back</Typography>
				</div>
				<img
					src={imagePath}
					alt={property.propertyTitle}
					style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
				/>
				<Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
					{property.propertyTitle}
				</Typography>
				<Typography variant="body2" sx={{ color: '#717171', mb: 1 }}>
					{property.propertyAddress}, {property.propertyLocation}
				</Typography>
				<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
					${formatterStr(property.propertyPrice)} / night
				</Typography>
				<Stack direction="row" spacing={2} mb={2}>
					<Stack direction="row" alignItems="center" spacing={1}>
						<BedIcon fontSize="small" />
						<Typography variant="body2">{property.propertyBeds} beds</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={1}>
						<MeetingRoomIcon fontSize="small" />
						<Typography variant="body2">{property.propertyRooms} rooms</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={1}>
						<SquareFootIcon fontSize="small" />
						<Typography variant="body2">{property.propertySquare} m²</Typography>
					</Stack>
				</Stack>
				<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
					About this stay
				</Typography>
				<Typography variant="body2" sx={{ lineHeight: 1.8, mb: 3 }}>
					{property.propertyDesc || `A comfortable stay in ${countryLabel} with easy access to the city.`}
				</Typography>

				{/* Highlights section – mobile */}
				<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
					Highlights for your trip
				</Typography>
				<Stack spacing={1.5} mb={3}>
					<Stack direction="row" spacing={1.5} alignItems="flex-start">
						<CheckCircleOutlineIcon sx={{ mt: 0.3 }} color="success" />
						<div>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								Exceptional service &amp; staff
							</Typography>
							<Typography variant="body2" sx={{ color: '#4b5563' }}>
								Guests say the team here in {countryLabel} is welcoming and helpful.
							</Typography>
						</div>
					</Stack>
					<Stack direction="row" spacing={1.5} alignItems="flex-start">
						<LocalParkingIcon sx={{ mt: 0.3 }} />
						<div>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								Onsite parking available
							</Typography>
							<Typography variant="body2" sx={{ color: '#4b5563' }}>
								Convenient parking so you can explore {countryLabel} with ease.
							</Typography>
						</div>
					</Stack>
					<Stack direction="row" spacing={1.5} alignItems="flex-start">
						<EmojiTransportationIcon sx={{ mt: 0.3 }} />
						<div>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								Easy to get around
							</Typography>
							<Typography variant="body2" sx={{ color: '#4b5563' }}>
								Popular spots in {countryLabel} are reachable by nearby transport.
							</Typography>
						</div>
					</Stack>
				</Stack>

				{/* About this property amenities – mobile */}
				<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
					About this property
				</Typography>
				<Typography variant="body2" sx={{ color: '#4b5563', mb: 1.5 }}>
					Comfortable hotel-style stay in {countryLabel}, ideal for both short city breaks and longer visits.
				</Typography>
				<Stack spacing={1.2} mb={4}>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<RestaurantIcon fontSize="small" />
						<Typography variant="body2">Breakfast options available nearby</Typography>
					</Stack>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<WifiIcon fontSize="small" />
						<Typography variant="body2">Free Wi‑Fi in the property</Typography>
					</Stack>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<PetsIcon fontSize="small" />
						<Typography variant="body2">Pet‑friendly on request</Typography>
					</Stack>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<DirectionsCarIcon fontSize="small" />
						<Typography variant="body2">Good access to main roads and public transport</Typography>
					</Stack>

					{/* Leave A Review Section - Mobile */}
					<Stack spacing={2} sx={{ mt: 3, pt: 3, borderTop: '1px solid #e5e7eb' }}>
						<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
							Leave A Review
						</Typography>
						<Typography variant="body2" sx={{ color: '#4b5563' }}>
							Review
						</Typography>
						<textarea
							onChange={(e) => {
								setInsertCommentData({ ...insertCommentData, commentContent: e.target.value });
							}}
							value={insertCommentData.commentContent}
							style={{
								width: '100%',
								minHeight: '100px',
								padding: '12px',
								border: '1px solid #e5e7eb',
								borderRadius: '8px',
								fontSize: '14px',
								fontFamily: 'inherit',
								resize: 'vertical',
							}}
							placeholder="Write your review here..."
						/>
						<Button
							variant="contained"
							fullWidth
							disabled={insertCommentData.commentContent === '' || !user?._id}
							onClick={createCommentHandler}
							sx={{
								textTransform: 'none',
								py: 1.5,
								borderRadius: '8px',
								backgroundColor: '#181a20',
								color: '#ffffff',
								'&:hover': {
									backgroundColor: '#2d2d2d',
									color: '#ffffff',
								},
								'&:disabled': {
									backgroundColor: '#e5e7eb',
									color: '#9ca3af',
								},
							}}
						>
							<Typography sx={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>Submit Review</Typography>
						</Button>
					</Stack>

					{/* Comments Section - Mobile */}
					{(propertyComments.length > 0 || commentTotal > 0) && (
						<Stack spacing={2} sx={{ mt: 3, pt: 3, borderTop: '1px solid #e5e7eb' }}>
							{propertyComments.length > 0 ? (
								<>
									{propertyComments.map((comment: Comment) => (
										<Review key={comment?._id} comment={comment} />
									))}
									{propertyComments.length < commentTotal && (
										<div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
											<Button
												variant="outlined"
												onClick={loadMoreCommentsHandler}
												sx={{
													textTransform: 'none',
													px: 3,
													py: 1,
													borderRadius: '8px',
													borderColor: '#181a20',
													color: '#181a20',
													'&:hover': {
														borderColor: '#2d2d2d',
														backgroundColor: '#f9fafb',
													},
												}}
											>
												Next
											</Button>
										</div>
									)}
								</>
							) : (
								<Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center', py: 2 }}>
									Loading comments...
								</Typography>
							)}
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	}

	// Desktop layout
	return (
		<Stack id="property-detail-page">
			<div className="container">
				<Stack className="property-detail-config">
					{/* Property Header Section */}
					<Stack className="property-header" spacing={2} sx={{ mb: 4 }}>
						{/* Property Name and Rating */}
						<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
							<Stack spacing={1.5} sx={{ flex: 1 }}>
								<Typography className="property-name">{property.propertyTitle}</Typography>
								<Stack direction="row" alignItems="center" spacing={1}>
									<Stack direction="row" spacing={0.2}>
										{[...Array(4)].map((_, idx) => (
											<StarRoundedIcon key={idx} sx={{ fontSize: 20, color: '#fbbf24' }} />
										))}
									</Stack>
								</Stack>
							</Stack>
						</Stack>

						{/* Booking Policies */}
						<Stack direction="row" spacing={2} sx={{ mb: 2 }}>
							<Stack direction="row" alignItems="center" spacing={0.8}>
								<CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
								<Typography sx={{ fontSize: 14, color: '#16a34a', fontWeight: 500 }}>Fully refundable</Typography>
							</Stack>
							<Stack direction="row" alignItems="center" spacing={0.8}>
								<CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />
								<Typography sx={{ fontSize: 14, color: '#16a34a', fontWeight: 500 }}>Reserve now, pay later</Typography>
							</Stack>
						</Stack>

						{/* Review Score */}
						<Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
							<div
								style={{
									backgroundColor: '#16a34a',
									color: '#fff',
									borderRadius: '8px',
									padding: '4px 12px',
									fontWeight: 700,
									fontSize: 16,
								}}
							>
								9.2
							</div>
							<Typography sx={{ fontWeight: 600, fontSize: 16 }}>Wonderful</Typography>
							<Link
								href="#reviews"
								sx={{
									ml: 1,
									fontSize: 14,
									color: '#2563eb',
									cursor: 'pointer',
									textDecoration: 'none',
									display: 'flex',
									alignItems: 'center',
									gap: 0.5,
									'&:hover': {
										textDecoration: 'underline',
									},
								}}
							>
								See all {(property.propertyViews ?? 0).toLocaleString()} reviews
								<ArrowForwardIcon sx={{ fontSize: 14 }} />
							</Link>
						</Stack>

						{/* Main Image */}
						<div className="main-image">
							<img src={imagePath} alt={property.propertyTitle} />
						</div>
					</Stack>

					{/* Main Content - Two Column Layout */}
					<Stack className="property-desc-config" direction="row" spacing={4}>
						{/* Left Column - Highlights and About */}
						<Stack className="left-config" sx={{ flex: '1 1 60%' }} spacing={4}>
							{/* Highlights Section */}
							<Stack spacing={2}>
								<Typography sx={{ fontWeight: 600, fontSize: 20, mb: 1 }}>Highlights for your 2-night trip</Typography>
								<Stack spacing={2.5}>
									<Stack direction="row" spacing={2} alignItems="flex-start">
										<div
											style={{
												width: 48,
												height: 48,
												borderRadius: '50%',
												backgroundColor: '#f5f5f0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexShrink: 0,
											}}
										>
											<CheckCircleOutlineIcon sx={{ fontSize: 24, color: '#16a34a' }} />
										</div>
										<div>
											<Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
												Exceptional service &amp; staff
											</Typography>
											<Typography sx={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
												The top-rated staff and service will ensure you feel welcome and pampered.
											</Typography>
										</div>
									</Stack>
									<Stack direction="row" spacing={2} alignItems="flex-start">
										<div
											style={{
												width: 48,
												height: 48,
												borderRadius: '50%',
												backgroundColor: '#f5f5f0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexShrink: 0,
											}}
										>
											<LocalParkingIcon sx={{ fontSize: 24, color: '#181a20' }} />
										</div>
										<div>
											<Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>Onsite parking available</Typography>
											<Typography sx={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
												Convenient and secure onsite parking, a rare amenity in the area.
											</Typography>
										</div>
									</Stack>
									<Stack direction="row" spacing={2} alignItems="flex-start">
										<div
											style={{
												width: 48,
												height: 48,
												borderRadius: '50%',
												backgroundColor: '#f5f5f0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexShrink: 0,
											}}
										>
											<EmojiTransportationIcon sx={{ fontSize: 24, color: '#181a20' }} />
										</div>
										<div>
											<Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>Easy to get around</Typography>
											<Typography sx={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
												Guests love the convenient spot for exploring the area.
											</Typography>
										</div>
									</Stack>
									<Stack direction="row" spacing={2} alignItems="flex-start">
										<div
											style={{
												width: 48,
												height: 48,
												borderRadius: '50%',
												backgroundColor: '#f5f5f0',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexShrink: 0,
											}}
										>
											<LocationOnIcon sx={{ fontSize: 24, color: '#181a20' }} />
										</div>
										<div>
											<Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>Discover nearby landmarks</Typography>
											<Typography sx={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
												Near {countryLabel}
											</Typography>
										</div>
									</Stack>
								</Stack>
							</Stack>

							{/* About This Property Section */}
							<Stack spacing={2}>
								<Typography sx={{ fontWeight: 600, fontSize: 20, mb: 1 }}>About this property</Typography>
								<Typography sx={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, mb: 2 }}>
									Pet-friendly hotel with restaurant, connected to a rail/subway station, near {countryLabel}.
								</Typography>
								<Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap', rowGap: 2, columnGap: 4 }}>
									<Stack direction="row" spacing={1.2} alignItems="center">
										<RestaurantIcon fontSize="small" sx={{ color: '#4b5563' }} />
										<Typography sx={{ fontSize: 14 }}>Buffet breakfast available</Typography>
									</Stack>
									<Stack direction="row" spacing={1.2} alignItems="center">
										<PetsIcon fontSize="small" sx={{ color: '#4b5563' }} />
										<Typography sx={{ fontSize: 14 }}>Dog-friendly</Typography>
									</Stack>
									<Stack direction="row" spacing={1.2} alignItems="center">
										<WifiIcon fontSize="small" sx={{ color: '#4b5563' }} />
										<Typography sx={{ fontSize: 14 }}>Free WiFi</Typography>
									</Stack>
									<Stack direction="row" spacing={1.2} alignItems="center">
										<LocalParkingIcon fontSize="small" sx={{ color: '#4b5563' }} />
										<Typography sx={{ fontSize: 14 }}>Self-parking included</Typography>
									</Stack>
									<Stack direction="row" spacing={1.2} alignItems="center">
										<RestaurantIcon fontSize="small" sx={{ color: '#4b5563' }} />
										<Typography sx={{ fontSize: 14 }}>Restaurant</Typography>
									</Stack>
									<Stack direction="row" spacing={1.2} alignItems="center">
										<div
											style={{
												width: 20,
												height: 20,
												borderRadius: '4px',
												border: '1px solid #4b5563',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<Typography sx={{ fontSize: 10, color: '#4b5563' }}>B</Typography>
										</div>
										<Typography sx={{ fontSize: 14 }}>Balcony</Typography>
									</Stack>
								</Stack>
							</Stack>

							{/* Explore the area */}
							<Stack spacing={3}>
								<Typography sx={{ fontWeight: 600, fontSize: 20, mb: 1 }}>Explore the area</Typography>

								{/* Map */}
								<div
									style={{
										width: '100%',
										height: 300,
										borderRadius: '12px',
										overflow: 'hidden',
										border: '1px solid #e5e7eb',
									}}
								>
									<iframe
										width="100%"
										height="100%"
										style={{ border: 0 }}
										loading="lazy"
										allowFullScreen
										src={`https://www.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=${mapCoords.zoom}&output=embed`}
									></iframe>
								</div>

								{/* Address */}
								<Stack spacing={1}>
									<Typography sx={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
										{property.propertyAddress}, {property.propertyLocation}
									</Typography>
									<Link
										href={`https://www.google.com/maps/@${mapCoords.lat},${mapCoords.lng},${mapCoords.zoom}z`}
										target="_blank"
										rel="noopener noreferrer"
										sx={{
											fontSize: 14,
											color: '#2563eb',
											cursor: 'pointer',
											textDecoration: 'none',
											display: 'flex',
											alignItems: 'center',
											gap: 0.5,
											width: 'fit-content',
											'&:hover': {
												textDecoration: 'underline',
											},
										}}
									>
										View in a map
										<ArrowForwardIcon sx={{ fontSize: 14 }} />
									</Link>
								</Stack>

								{/* Nearby Attractions */}
								<Stack spacing={1.5}>
									<Stack direction="row" alignItems="center" spacing={1}>
										<LocationOnIcon sx={{ fontSize: 18, color: '#4b5563' }} />
										<Typography sx={{ fontSize: 14 }}>Cheonggyecheon</Typography>
										<Typography sx={{ fontSize: 14, color: '#6b7280', ml: 'auto' }}>1 min walk</Typography>
									</Stack>
									<Stack direction="row" alignItems="center" spacing={1}>
										<LocationOnIcon sx={{ fontSize: 18, color: '#4b5563' }} />
										<Typography sx={{ fontSize: 14 }}>Gwangjang Market</Typography>
										<Typography sx={{ fontSize: 14, color: '#6b7280', ml: 'auto' }}>5 min walk</Typography>
									</Stack>
									<Stack direction="row" alignItems="center" spacing={1}>
										<LocationOnIcon sx={{ fontSize: 18, color: '#4b5563' }} />
										<Typography sx={{ fontSize: 14 }}>{countryLabel}</Typography>
										<Typography sx={{ fontSize: 14, color: '#6b7280', ml: 'auto' }}>14 min walk</Typography>
									</Stack>
									<Stack direction="row" alignItems="center" spacing={1}>
										<FlightIcon sx={{ fontSize: 18, color: '#4b5563' }} />
										<Typography sx={{ fontSize: 14 }}>{countryLabel} Airport</Typography>
										<Typography sx={{ fontSize: 14, color: '#6b7280', ml: 'auto' }}>40 min drive</Typography>
									</Stack>
									<Link
										href="#area"
										sx={{
											fontSize: 14,
											color: '#2563eb',
											cursor: 'pointer',
											textDecoration: 'none',
											display: 'flex',
											alignItems: 'center',
											gap: 0.5,
											mt: 1,
											width: 'fit-content',
											'&:hover': {
												textDecoration: 'underline',
											},
										}}
									>
										See all about this area
										<ArrowForwardIcon sx={{ fontSize: 14 }} />
									</Link>
								</Stack>
							</Stack>
						</Stack>

						{/* Right Column - Booking Form and Explore the Area */}
						<Stack className="right-config" sx={{ flex: '1 1 40%' }} spacing={3}>
							{/* Booking Form */}
							<Stack
								sx={{
									p: 3,
									borderRadius: '16px',
									backgroundColor: '#ffffff',
									boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
									position: 'relative',
									'&::before': {
										content: '""',
										position: 'absolute',
										inset: 0,
										borderRadius: '16px',
										padding: '2px',
										background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
										WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
										WebkitMaskComposite: 'xor',
										maskComposite: 'exclude',
										zIndex: -1,
									},
								}}
								spacing={3}
							>
								{/* Header */}
								<Stack spacing={1}>
									<Typography
										sx={{
											fontWeight: 700,
											fontSize: 24,
											background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
										}}
									>
										Book Your Tour
									</Typography>
									<Typography sx={{ fontSize: 14, color: '#6b7280' }}>
										Reserve your ideal trip early for a hassle-free trip; secure comfort and convenience!
									</Typography>
								</Stack>

								{/* Booking Type Buttons */}
								<Stack direction="row" spacing={2}>
									<Button
										variant={bookingType === 'online' ? 'contained' : 'outlined'}
										onClick={() => setBookingType('online')}
										sx={{
											flex: 1,
											textTransform: 'none',
											py: 1.5,
											borderRadius: '8px',
											background:
												bookingType === 'online' ? 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)' : 'transparent',
											color: bookingType === 'online' ? '#ffffff' : undefined,
											border: bookingType === 'online' ? 'none' : '2px solid transparent',
											position: 'relative',
											'&::before':
												bookingType === 'online'
													? {}
													: {
															content: '""',
															position: 'absolute',
															inset: 0,
															borderRadius: '8px',
															padding: '2px',
															background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
															WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
															WebkitMaskComposite: 'xor',
															maskComposite: 'exclude',
															zIndex: -1,
													  },
											'& .MuiButton-label':
												bookingType === 'online'
													? {}
													: {
															background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
															WebkitBackgroundClip: 'text',
															WebkitTextFillColor: 'transparent',
															backgroundClip: 'text',
													  },
											fontWeight: 600,
											'&:hover': {
												background:
													bookingType === 'online'
														? 'linear-gradient(135deg, #c91e1a 0%, #10b981 100%)'
														: 'linear-gradient(135deg, rgba(233, 44, 40, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)',
											},
										}}
									>
										ONLINE BOOKING
									</Button>
									<Button
										variant={bookingType === 'inquiry' ? 'contained' : 'outlined'}
										onClick={() => setBookingType('inquiry')}
										sx={{
											flex: 1,
											textTransform: 'none',
											py: 1.5,
											borderRadius: '8px',
											background:
												bookingType === 'inquiry' ? 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)' : 'transparent',
											color: bookingType === 'inquiry' ? '#ffffff' : undefined,
											border: bookingType === 'inquiry' ? 'none' : '2px solid transparent',
											position: 'relative',
											'&::before':
												bookingType === 'inquiry'
													? {}
													: {
															content: '""',
															position: 'absolute',
															inset: 0,
															borderRadius: '8px',
															padding: '2px',
															background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
															WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
															WebkitMaskComposite: 'xor',
															maskComposite: 'exclude',
															zIndex: -1,
													  },
											'& .MuiButton-label':
												bookingType === 'inquiry'
													? {}
													: {
															background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
															WebkitBackgroundClip: 'text',
															WebkitTextFillColor: 'transparent',
															backgroundClip: 'text',
													  },
											fontWeight: 600,
											'&:hover': {
												background:
													bookingType === 'inquiry'
														? 'linear-gradient(135deg, #c91e1a 0%, #10b981 100%)'
														: 'linear-gradient(135deg, rgba(233, 44, 40, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)',
											},
										}}
									>
										INQUIRY FORM
									</Button>
								</Stack>

								{/* Booking Date Section */}
								<Stack spacing={2}>
									<Typography sx={{ fontWeight: 700, fontSize: 14, color: '#181a20', textTransform: 'uppercase' }}>
										SELECT BOOKING DATE
									</Typography>
									<Stack direction="row" spacing={2} alignItems="center">
										<TextField
											type="date"
											label="CHECK IN"
											value={checkInDate}
											onChange={(e) => setCheckInDate(e.target.value)}
											InputLabelProps={{ shrink: true }}
											sx={{
												flex: 1,
												'& .MuiOutlinedInput-root': {
													borderRadius: '8px',
												},
											}}
											InputProps={{
												endAdornment: <CalendarTodayIcon sx={{ color: '#6b7280', mr: 1 }} />,
											}}
										/>
										<ArrowForwardIcon sx={{ color: '#6b7280' }} />
										<TextField
											type="date"
											label="CHECK OUT"
											value={checkOutDate}
											onChange={(e) => setCheckOutDate(e.target.value)}
											InputLabelProps={{ shrink: true }}
											sx={{
												flex: 1,
												'& .MuiOutlinedInput-root': {
													borderRadius: '8px',
												},
											}}
											InputProps={{
												endAdornment: <CalendarTodayIcon sx={{ color: '#6b7280', mr: 1 }} />,
											}}
										/>
									</Stack>
								</Stack>

								{/* Guest Selection */}
								<Stack spacing={2}>
									{/* Adults */}
									<Stack spacing={1.5}>
										<Stack direction="row" justifyContent="space-between" alignItems="center">
											<Typography sx={{ fontWeight: 600, fontSize: 14, color: '#181a20' }}>Adult</Typography>
											<Stack direction="row" spacing={1} alignItems="center">
												<Typography sx={{ fontSize: 14, color: '#6b7280', textDecoration: 'line-through' }}>
													${(property.propertyPrice * 1.37).toFixed(0)}
												</Typography>
												<Typography
													sx={{
														fontSize: 16,
														fontWeight: 600,
														background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
														WebkitBackgroundClip: 'text',
														WebkitTextFillColor: 'transparent',
														backgroundClip: 'text',
													}}
												>
													${formatterStr(property.propertyPrice)}
												</Typography>
											</Stack>
										</Stack>
										<Stack direction="row" spacing={2} alignItems="center">
											<IconButton
												onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
												sx={{
													width: 40,
													height: 40,
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
													color: '#ffffff',
													'&:hover': {
														background: 'linear-gradient(135deg, #c91e1a 0%, #10b981 100%)',
													},
												}}
											>
												<RemoveIcon />
											</IconButton>
											<Typography
												sx={{ fontSize: 18, fontWeight: 600, color: '#181a20', minWidth: 40, textAlign: 'center' }}
											>
												{String(adultCount).padStart(2, '0')}
											</Typography>
											<IconButton
												onClick={() => setAdultCount(adultCount + 1)}
												sx={{
													width: 40,
													height: 40,
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
													color: '#ffffff',
													'&:hover': {
														background: 'linear-gradient(135deg, #c91e1a 0%, #10b981 100%)',
													},
												}}
											>
												<AddIcon />
											</IconButton>
										</Stack>
									</Stack>

									{/* Children */}
									<Stack spacing={1.5}>
										<Stack direction="row" justifyContent="space-between" alignItems="center">
											<Typography sx={{ fontWeight: 600, fontSize: 14, color: '#181a20' }}>Children</Typography>
											<Typography sx={{ fontSize: 16, fontWeight: 600, color: '#6b7280' }}>$18</Typography>
										</Stack>
										<Stack direction="row" spacing={2} alignItems="center">
											<IconButton
												onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
												sx={{
													width: 40,
													height: 40,
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
													color: '#ffffff',
													'&:hover': {
														background: 'linear-gradient(135deg, #c91e1a 0%, #10b981 100%)',
													},
												}}
											>
												<RemoveIcon />
											</IconButton>
											<Typography
												sx={{ fontSize: 18, fontWeight: 600, color: '#181a20', minWidth: 40, textAlign: 'center' }}
											>
												{String(childrenCount).padStart(2, '0')}
											</Typography>
											<IconButton
												onClick={() => setChildrenCount(childrenCount + 1)}
												sx={{
													width: 40,
													height: 40,
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
													color: '#ffffff',
													'&:hover': {
														background: 'linear-gradient(135deg, #c91e1a 0%, #10b981 100%)',
													},
												}}
											>
												<AddIcon />
											</IconButton>
										</Stack>
									</Stack>
								</Stack>

								{/* Total Price */}
								<Stack
									direction="row"
									justifyContent="space-between"
									alignItems="center"
									sx={{
										py: 2,
										px: 2,
										borderRadius: '8px',
										background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)',
									}}
								>
									<Typography
										sx={{
											fontSize: 16,
											fontWeight: 600,
											background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
										}}
									>
										Total Price:
									</Typography>
									<Typography
										sx={{
											fontSize: 24,
											fontWeight: 700,
											background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
										}}
									>
										${formatterStr(property.propertyPrice * adultCount + 18 * childrenCount)}
									</Typography>
								</Stack>

								{/* Book Now Button */}
								<Button
									variant="contained"
									fullWidth
									sx={{
										textTransform: 'none',
										py: 2,
										borderRadius: '12px',
										background: 'linear-gradient(135deg, #E92C28 0%, #34d399 100%)',
										color: '#ffffff',
										fontSize: 16,
										fontWeight: 700,
										'&:hover': {
											background: 'linear-gradient(135deg, #dc2626 0%, #15803d 100%)',
										},
									}}
									endIcon={<ArrowForwardIcon />}
								>
									BOOK NOW
								</Button>

								{/* Property Owner */}
								<Stack spacing={2} sx={{ pt: 2, borderTop: '1px solid #e5e7eb' }}>
									<Typography sx={{ fontWeight: 700, fontSize: 14, color: '#181a20', textTransform: 'uppercase' }}>
										PROPERTY OWNER
									</Typography>
									<Stack direction="row" spacing={2} alignItems="center">
										<img
											src={
												property.memberData?.memberImage
													? `${REACT_APP_API_URL}/${property.memberData.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
											alt={property.memberData?.memberFullName || property.memberData?.memberNick || 'Owner'}
											style={{
												width: 60,
												height: 60,
												borderRadius: '50%',
												objectFit: 'cover',
											}}
										/>
										<Stack spacing={0.5}>
											<Typography sx={{ fontWeight: 600, fontSize: 16, color: '#181a20' }}>
												{property.memberData?.memberFullName || property.memberData?.memberNick || 'Owner'}
											</Typography>
											{property.memberData?.memberPhone && (
												<Typography sx={{ fontSize: 14, color: '#6b7280' }}>
													{property.memberData.memberPhone}
												</Typography>
											)}
										</Stack>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					</Stack>

					{/* Leave A Review Section */}
					<Stack spacing={2} sx={{ mt: 4, pt: 4, borderTop: '1px solid #e5e7eb' }}>
						<Typography sx={{ fontWeight: 600, fontSize: 20 }}>Leave A Review</Typography>
						<Typography sx={{ fontSize: 14, color: '#4b5563', mb: 1 }}>Review</Typography>
						<textarea
							onChange={(e) => {
								setInsertCommentData({ ...insertCommentData, commentContent: e.target.value });
							}}
							value={insertCommentData.commentContent}
							style={{
								width: '100%',
								minHeight: '120px',
								padding: '12px',
								border: '1px solid #e5e7eb',
								borderRadius: '8px',
								fontSize: '14px',
								fontFamily: 'inherit',
								resize: 'vertical',
							}}
							placeholder="Write your review here..."
						/>
						<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button
								variant="contained"
								disabled={insertCommentData.commentContent === '' || !user?._id}
								onClick={createCommentHandler}
								sx={{
									textTransform: 'none',
									px: 3,
									py: 1.5,
									borderRadius: '8px',
									backgroundColor: '#181a20',
									color: '#ffffff',
									'&:hover': {
										backgroundColor: '#2d2d2d',
										color: '#ffffff',
									},
									'&:disabled': {
										backgroundColor: '#e5e7eb',
										color: '#9ca3af',
									},
								}}
							>
								<Typography sx={{ fontSize: 14, fontWeight: 600, mr: 1, color: '#ffffff' }}>Submit Review</Typography>
								<ArrowForwardIcon sx={{ fontSize: 16, color: '#ffffff' }} />
							</Button>
						</div>
					</Stack>

					{/* Comments Section */}
					{(propertyComments.length > 0 || commentTotal > 0) && (
						<Stack spacing={3} sx={{ mt: 4, pt: 4, borderTop: '1px solid #e5e7eb' }}>
							{propertyComments.length > 0 ? (
								<>
									{propertyComments.map((comment: Comment) => (
										<Review key={comment?._id} comment={comment} />
									))}
									{propertyComments.length < commentTotal && (
										<div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
											<Button
												variant="outlined"
												onClick={loadMoreCommentsHandler}
												sx={{
													textTransform: 'none',
													px: 4,
													py: 1.5,
													borderRadius: '8px',
													borderColor: '#181a20',
													color: '#181a20',
													'&:hover': {
														borderColor: '#2d2d2d',
														backgroundColor: '#f9fafb',
													},
												}}
											>
												Next
											</Button>
										</div>
									)}
								</>
							) : (
								<Typography sx={{ fontSize: 14, color: '#6b7280', textAlign: 'center', py: 2 }}>
									Loading comments...
								</Typography>
							)}
						</Stack>
					)}
				</Stack>
			</div>
		</Stack>
	);
};

export default withLayoutBasic(PropertyDetail);
