import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { Box, Stack, Typography, Button } from '@mui/material';
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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const propertyId = router.query.id as string | undefined;

	const { data, loading } = useQuery<{ getProperty: Property }>(GET_PROPERTY, {
		variables: { input: propertyId ?? '' },
		skip: !propertyId,
		fetchPolicy: 'network-only',
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

	if (!propertyId) {
		return (
			<Stack id="property-detail-page" alignItems="center" justifyContent="center" minHeight="50vh">
				<Typography>Hotel ID is missing.</Typography>
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

	if (!property) {
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

	const imagePath: string = property?.propertyImages?.[0]
		? `${REACT_APP_API_URL}/${property.propertyImages[0]}`
		: '/img/banner/header1.svg';

	const countryLabel = property.propertyLocation || 'this destination';

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
					<Stack className="property-info-config">
						<Stack className="info">
							<Stack className="left-box">
								<Typography className="title-main">{property.propertyTitle}</Typography>
								<Stack className="top-box">
									<Typography className="city">
										{property.propertyAddress}, {property.propertyLocation}
									</Typography>
								</Stack>
								<Stack className="bottom-box">
									<Stack className="option" direction="row" alignItems="center" spacing={1}>
										<BedIcon fontSize="small" />
										<Typography>{property.propertyBeds} beds</Typography>
									</Stack>
									<Stack className="option" direction="row" alignItems="center" spacing={1}>
										<MeetingRoomIcon fontSize="small" />
										<Typography>{property.propertyRooms} rooms</Typography>
									</Stack>
									<Stack className="option" direction="row" alignItems="center" spacing={1}>
										<SquareFootIcon fontSize="small" />
										<Typography>{property.propertySquare} m²</Typography>
									</Stack>
								</Stack>
							</Stack>
							<Stack className="right-box" alignItems="flex-end" spacing={1}>
								<Stack className="buttons" direction="row" spacing={2} alignItems="center">
									<Typography>${formatterStr(property.propertyPrice)} / night</Typography>
								</Stack>
							</Stack>
						</Stack>
						<Stack className="images">
							<Box className="main-image">
								<img src={imagePath} alt={property.propertyTitle} />
							</Box>
						</Stack>
					</Stack>

					<Stack className="property-desc-config" direction="row" spacing={4} sx={{ mt: 4 }}>
						{/* Left column – main description */}
						<Stack className="left-config" sx={{ flex: 2 }}>
							<Stack className="prop-desc-config">
								<Stack className="top" spacing={1.5}>
									<Typography className="title">About this stay</Typography>
									<Typography className="desc">
										{property.propertyDesc ||
											`A comfortable base in ${countryLabel}, with easy access to local attractions and city life.`}
									</Typography>
								</Stack>
							</Stack>
						</Stack>

						{/* Right column – highlights and amenities, similar to booking sites */}
						<Stack className="right-config" sx={{ flex: 3 }}>
							{/* Rating summary */}
							<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
								<Box
									sx={{
										backgroundColor: '#16a34a',
										color: '#fff',
										borderRadius: '8px',
										px: 1.4,
										py: 0.4,
										fontWeight: 700,
										fontSize: 14,
									}}
								>
									9.2
								</Box>
								<Typography sx={{ fontWeight: 600 }}>Wonderful</Typography>
								<Typography sx={{ ml: 1, fontSize: 14, color: '#2563eb', cursor: 'pointer' }}>
									See all {(property.propertyViews ?? 0).toLocaleString()} reviews
								</Typography>
							</Stack>

							{/* Highlights */}
							<Typography sx={{ fontWeight: 600, mb: 1 }}>Highlights for your trip</Typography>
							<Stack spacing={1.5} sx={{ mb: 3 }}>
								<Stack direction="row" spacing={1.5} alignItems="flex-start">
									<CheckCircleOutlineIcon sx={{ mt: 0.3 }} color="success" />
									<Box>
										<Typography sx={{ fontWeight: 600, fontSize: 14 }}>Exceptional service &amp; staff</Typography>
										<Typography sx={{ fontSize: 14, color: '#4b5563' }}>
											Guests highlight friendly, attentive staff in {countryLabel}.
										</Typography>
									</Box>
								</Stack>
								<Stack direction="row" spacing={1.5} alignItems="flex-start">
									<LocalParkingIcon sx={{ mt: 0.3 }} />
									<Box>
										<Typography sx={{ fontWeight: 600, fontSize: 14 }}>Onsite parking available</Typography>
										<Typography sx={{ fontSize: 14, color: '#4b5563' }}>
											Convenient parking makes it easier to explore {countryLabel} by car.
										</Typography>
									</Box>
								</Stack>
								<Stack direction="row" spacing={1.5} alignItems="flex-start">
									<EmojiTransportationIcon sx={{ mt: 0.3 }} />
									<Box>
										<Typography sx={{ fontWeight: 600, fontSize: 14 }}>Easy to get around</Typography>
										<Typography sx={{ fontSize: 14, color: '#4b5563' }}>
											Guests love the access to public transport and nearby city spots.
										</Typography>
									</Box>
								</Stack>
							</Stack>

							{/* Amenities list */}
							<Typography sx={{ fontWeight: 600, mb: 1 }}>About this property</Typography>
							<Typography sx={{ fontSize: 14, color: '#4b5563', mb: 2 }}>
								Hotel‑style property in {countryLabel}, good for city breaks, business trips, and longer stays.
							</Typography>
							<Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap', rowGap: 1.5, columnGap: 4 }}>
								<Stack direction="row" spacing={1.2} alignItems="center">
									<RestaurantIcon fontSize="small" />
									<Typography sx={{ fontSize: 14 }}>Breakfast options nearby</Typography>
								</Stack>
								<Stack direction="row" spacing={1.2} alignItems="center">
									<WifiIcon fontSize="small" />
									<Typography sx={{ fontSize: 14 }}>Free Wi‑Fi</Typography>
								</Stack>
								<Stack direction="row" spacing={1.2} alignItems="center">
									<PetsIcon fontSize="small" />
									<Typography sx={{ fontSize: 14 }}>Pet‑friendly on request</Typography>
								</Stack>
								<Stack direction="row" spacing={1.2} alignItems="center">
									<DirectionsCarIcon fontSize="small" />
									<Typography sx={{ fontSize: 14 }}>Good access to main roads &amp; transport</Typography>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</div>
		</Stack>
	);
};

export default withLayoutBasic(PropertyDetail);
