import React, { useRef } from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AnimatedNumber, { AnimatedNumberRef } from './AnimatedNumber';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

interface PropertyBigCardProps {
	property: Property;
	likePropertyHandler: any;
}

const PropertyBigCard = (props: PropertyBigCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const bedNumberRef = useRef<AnimatedNumberRef>(null);
	const roomNumberRef = useRef<AnimatedNumberRef>(null);

	/** HANDLERS **/
	const goPropertyDetatilPage = (propertyId: string) => {
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
		router.push(`/property/detail?id=${propertyId}`, undefined, { scroll: false });
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
		return <div>APARTMEND BIG CARD</div>;
	} else {
		return (
			<Stack
				className="property-big-card-box"
				onClick={() => goPropertyDetatilPage(property?._id)}
				onMouseEnter={handleCardMouseEnter}
				onMouseLeave={handleCardMouseLeave}
			>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages?.[0]})` }}
				/>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{property?.propertyTitle}</strong>
					<p className={'desc'}>{property?.propertyAddress}</p>
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
					<Typography sx={{ mt: 0.5, fontSize: 14, fontWeight: 600 }}>
						From ${formatterStr(property?.propertyPrice)}
					</Typography>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div>
							{property?.propertyRent ? <p>Rent</p> : <span>Rent</span>}
							{property?.propertyBarter ? <p>Barter</p> : <span>Barter</span>}
						</div>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.stopPropagation();
								}}
							>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.propertyLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PropertyBigCard;
