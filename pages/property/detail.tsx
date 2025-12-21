import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { Box, Stack, Typography, Button, Link } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_PROPERTY } from '../../apollo/user/query';
import { Property } from '../../libs/types/property/property';
import { REACT_APP_API_URL } from '../../libs/config';
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

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	// Handle both string and array cases for Next.js router.query
	const rawId = router.isReady ? router.query.id : undefined;
	const rawPropertyId = Array.isArray(rawId) ? rawId[0] : rawId;
	// Ensure propertyId is a valid non-empty string
	const propertyId = rawPropertyId && String(rawPropertyId).trim() ? String(rawPropertyId).trim() : undefined;

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

	const property = data?.getProperty;

	useEffect(() => {
		// Always scroll to top when opening detail page
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0);
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		}
	}, [propertyId]);

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
				<Box
					onClick={() => router.back()}
					sx={{ cursor: 'pointer', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
				>
					<ArrowBackIcon />
					<Typography>Back</Typography>
				</Box>
				<Box
					component="img"
					src={imagePath}
					alt={property.propertyTitle}
					sx={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: '12px', mb: 2 }}
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
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								Exceptional service &amp; staff
							</Typography>
							<Typography variant="body2" sx={{ color: '#4b5563' }}>
								Guests say the team here in {countryLabel} is welcoming and helpful.
							</Typography>
						</Box>
					</Stack>
					<Stack direction="row" spacing={1.5} alignItems="flex-start">
						<LocalParkingIcon sx={{ mt: 0.3 }} />
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								Onsite parking available
							</Typography>
							<Typography variant="body2" sx={{ color: '#4b5563' }}>
								Convenient parking so you can explore {countryLabel} with ease.
							</Typography>
						</Box>
					</Stack>
					<Stack direction="row" spacing={1.5} alignItems="flex-start">
						<EmojiTransportationIcon sx={{ mt: 0.3 }} />
						<Box>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								Easy to get around
							</Typography>
							<Typography variant="body2" sx={{ color: '#4b5563' }}>
								Popular spots in {countryLabel} are reachable by nearby transport.
							</Typography>
						</Box>
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
							<Box
								sx={{
									backgroundColor: '#16a34a',
									color: '#fff',
									borderRadius: '8px',
									px: 1.5,
									py: 0.5,
									fontWeight: 700,
									fontSize: 16,
								}}
							>
								9.2
							</Box>
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
						<Box className="main-image">
							<img src={imagePath} alt={property.propertyTitle} />
						</Box>
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
										<Box
											sx={{
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
										</Box>
										<Box>
											<Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
												Exceptional service &amp; staff
											</Typography>
											<Typography sx={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
												The top-rated staff and service will ensure you feel welcome and pampered.
											</Typography>
										</Box>
									</Stack>
									<Stack direction="row" spacing={2} alignItems="flex-start">
										<Box
											sx={{
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
										</Box>
										<Box>
											<Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>Onsite parking available</Typography>
											<Typography sx={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
												Convenient and secure onsite parking, a rare amenity in the area.
											</Typography>
										</Box>
									</Stack>
									<Stack direction="row" spacing={2} alignItems="flex-start">
										<Box
											sx={{
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
										</Box>
										<Box>
											<Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>Easy to get around</Typography>
											<Typography sx={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
												Guests love the convenient spot for exploring the area.
											</Typography>
										</Box>
									</Stack>
									<Stack direction="row" spacing={2} alignItems="flex-start">
										<Box
											sx={{
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
										</Box>
										<Box>
											<Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>Discover nearby landmarks</Typography>
											<Typography sx={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
												Near {countryLabel}
											</Typography>
										</Box>
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
										<Box
											sx={{
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
										</Box>
										<Typography sx={{ fontSize: 14 }}>Balcony</Typography>
									</Stack>
								</Stack>
							</Stack>
						</Stack>

						{/* Right Column - Explore the Area */}
						<Stack className="right-config" sx={{ flex: '1 1 40%' }} spacing={3}>
							<Typography sx={{ fontWeight: 600, fontSize: 20, mb: 1 }}>Explore the area</Typography>

							{/* Map */}
							<Box
								sx={{
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
							</Box>

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
				</Stack>
			</div>
		</Stack>
	);
};

export default withLayoutBasic(PropertyDetail);
