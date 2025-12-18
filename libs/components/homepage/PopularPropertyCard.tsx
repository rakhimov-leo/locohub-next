import React, { useRef } from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { formatterStr } from '../../utils';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import AnimatedNumber, { AnimatedNumberRef } from '../common/AnimatedNumber';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

interface PopularPropertyCardProps {
	property: Property;
	likePropertyHandler: any;
}

const PopularPropertyCard = (props: PopularPropertyCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const bedNumberRef = useRef<AnimatedNumberRef>(null);
	const roomNumberRef = useRef<AnimatedNumberRef>(null);

	/** HANDLERS **/

	const pushDetailHandler = async (propertyId: string) => {
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
		console.log('propertyId:', propertyId);
		await router.push({ pathname: '/property/detail', query: { id: propertyId } }, undefined, { scroll: false });
	};

	const handleCardMouseEnter = () => {
		bedNumberRef.current?.startAnimation();
		roomNumberRef.current?.startAnimation();
	};

	const handleCardMouseLeave = () => {
		bedNumberRef.current?.reset();
		roomNumberRef.current?.reset();
	};

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box" onMouseEnter={handleCardMouseEnter} onMouseLeave={handleCardMouseLeave}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				/>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(property._id);
						}}
					>
						{property.propertyTitle}
					</strong>
					<p className={'desc'}>no description</p>
					{/* Price block placed directly under description */}
					{property?.propertyPrice && (
						<Box sx={{ mt: 0.5 }}>
							{(() => {
								const base = property.propertyPrice;
								const discountPercent = 24;
								const original = Math.round(base / (1 - discountPercent / 100));
								return (
									<>
										<Typography sx={{ fontSize: 11, fontWeight: 600, color: '#ef4444', mb: 0.3 }}>
											{discountPercent}% off
										</Typography>
										<Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
											${formatterStr(base)}{' '}
											<Typography
												component="span"
												className="old-price"
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
										<Typography sx={{ fontSize: 12, color: '#16a34a' }}>includes taxes &amp; fees</Typography>
									</>
								);
							})()}
						</Box>
					)}
					<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
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
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
							<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.propertyLikes || 0}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box" onMouseEnter={handleCardMouseEnter} onMouseLeave={handleCardMouseLeave}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				/>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(property._id);
						}}
					>
						{property.propertyTitle}
					</strong>
					<p className={'desc'}>no description</p>
					{/* Price block placed directly under description */}
					{property?.propertyPrice && (
						<Box sx={{ mt: 0.5 }}>
							{(() => {
								const base = property.propertyPrice;
								const discountPercent = 24;
								const original = Math.round(base / (1 - discountPercent / 100));
								return (
									<>
										<Typography sx={{ fontSize: 11, fontWeight: 600, color: '#ef4444', mb: 0.3 }}>
											{discountPercent}% off
										</Typography>
										<Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
											${formatterStr(base)}{' '}
											<Typography
												component="span"
												className="old-price"
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
										<Typography sx={{ fontSize: 12, color: '#16a34a' }}>includes taxes &amp; fees</Typography>
									</>
								);
							})()}
						</Box>
					)}
					<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
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
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
							<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.propertyLikes || 0}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularPropertyCard;
