import React, { useRef } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AnimatedNumber, { AnimatedNumberRef } from '../common/AnimatedNumber';

interface PropertyCardType {
	property: Property;
	likePropertyHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const PropertyCard = (props: PropertyCardType) => {
	const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const bedNumberRef = useRef<AnimatedNumberRef>(null);
	const roomNumberRef = useRef<AnimatedNumberRef>(null);
	const imagePath: string = property?.propertyImages[0]
		? `${REACT_APP_API_URL}/${property?.propertyImages[0]}`
		: '/img/banner/header1.svg';

	const handleCardMouseEnter = () => {
		bedNumberRef.current?.startAnimation();
		roomNumberRef.current?.startAnimation();
	};

	const handleCardMouseLeave = () => {
		bedNumberRef.current?.reset();
		roomNumberRef.current?.reset();
	};

	const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		// Save scroll position before navigating (always save if we're on homepage)
		if (typeof window !== 'undefined') {
			const currentPath = window.location.pathname;
			if (currentPath === '/' || currentPath.startsWith('/?')) {
				const scrollY =
					window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
				sessionStorage.setItem('homepageScrollPosition', scrollY.toString());
				sessionStorage.setItem('fromDetailPage', 'true');
				console.log('Saved scroll position:', scrollY);
			}
		}
		// Prevent default scroll behavior
		e.preventDefault();
		router.push(
			{
				pathname: '/property/detail',
				query: { id: property?._id },
			},
			undefined,
			{ scroll: false },
		);
	};

	if (device === 'mobile') {
		return <div>PROPERTY CARD</div>;
	} else {
		return (
			<Stack className="card-config" onMouseEnter={handleCardMouseEnter} onMouseLeave={handleCardMouseLeave}>
				<Stack className="top">
					<Link
						href={{
							pathname: '/property/detail',
							query: { id: property?._id },
						}}
						onClick={handleLinkClick}
					>
						<img src={imagePath} alt="" />
					</Link>
					{property && property?.propertyRank > topPropertyRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/property/detail',
									query: { id: property?._id },
								}}
								onClick={handleLinkClick}
							>
								<Typography>{property.propertyTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{property.propertyAddress}, {property.propertyLocation}
							</Typography>
						</Stack>
					</Stack>
					{/* Price block placed under address like homepage cards */}
					{property?.propertyPrice ? (
						<Box sx={{ mt: 0.5 }}>
							{(() => {
								const base = property.propertyPrice;
								const discountPercent = 24;
								const original = Math.round(base / (1 - discountPercent / 100));
								return (
									<>
										<Box
											sx={{
												display: 'inline-flex',
												alignItems: 'center',
												mb: 0.4,
												backgroundColor: '#ef4444',
												color: '#fff',
												borderRadius: '999px',
												px: 1,
												py: 0.3,
												fontSize: 11,
												fontWeight: 600,
											}}
										>
											{discountPercent}% off
										</Box>
										<Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
											From ${formatterStr(base)}{' '}
											<Typography
												component="span"
												sx={{
													ml: 0.5,
													fontSize: 13,
													color: '#9ca3af',
													textDecoration: 'line-through',
												}}
											>
												${formatterStr(original)}
											</Typography>
										</Typography>
										<Typography sx={{ fontSize: 12, color: '#16a34a' }}>✓ includes taxes &amp; fees</Typography>
									</>
								);
							})()}
						</Box>
					) : (
						<Box sx={{ mt: 0.5 }}>
							<Typography sx={{ fontSize: 14, fontWeight: 600 }}>Price on request</Typography>
						</Box>
					)}
					<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
						<Stack direction="row" spacing={0.3}>
							{[...Array(4)].map((_, idx) => (
								<StarRoundedIcon key={idx} sx={{ fontSize: 16, color: '#fbbf24' }} />
							))}
						</Stack>
						<Box
							sx={{
								ml: 0.5,
								px: 0.8,
								py: 0.1,
								borderRadius: '6px',
								backgroundColor: '#2563eb',
							}}
						>
							<Typography sx={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>9.2/10</Typography>
						</Box>
						<Typography sx={{ fontSize: 12, color: '#6b7280' }}>
							{(property?.propertyViews ?? 0).toLocaleString()} reviews
						</Typography>
					</Stack>
					{/* Bottom duplicate price removed */}
					<Stack className="divider"></Stack>
					<Stack className="type-buttons">
						<Stack className="type">
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								className={property.propertyRent ? '' : 'disabled-type'}
							>
								Rent
							</Typography>
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								className={property.propertyBarter ? '' : 'disabled-type'}
							>
								Barter
							</Typography>
						</Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{property?.propertyViews}</Typography>
								<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : property?.meLiked && property?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{property?.propertyLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default PropertyCard;
