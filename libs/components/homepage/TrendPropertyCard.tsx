import React, { useRef } from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import AnimatedNumber, { AnimatedNumberRef } from '../common/AnimatedNumber';

interface TrendPropertyCardProps {
	property: Property;
	likePropertyHandler: any;
}

const TrendPropertyCard = (props: TrendPropertyCardProps) => {
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
				const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
				sessionStorage.setItem('homepageScrollPosition', scrollY.toString());
				sessionStorage.setItem('fromDetailPage', 'true');
				console.log('Saved scroll position:', scrollY);
			}
		}
		console.log('propertyId:', propertyId);
		await router.push(
			{ pathname: '/property/detail', query: { id: propertyId } },
			undefined,
			{ scroll: false }
		);
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
			<Stack className="trend-card-box" key={property._id} onMouseEnter={handleCardMouseEnter} onMouseLeave={handleCardMouseLeave}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					<div>${property.propertyPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						className={'title'}
						onClick={() => {
							pushDetailHandler(property._id);
						}}
					>
						{property.propertyTitle}
						{''}
					</strong>
					<p className={'desc'}>{property.propertyDesc ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span><AnimatedNumber ref={bedNumberRef} value={property.propertyBeds} duration={2500} delay={0} /> bed</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span><AnimatedNumber ref={roomNumberRef} value={property.propertyRooms} duration={2500} delay={0} /> rooms</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property.propertySquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{property.propertyRent ? 'Rent' : ''} {property.propertyRent && property.propertyBarter && '/'}{' '}
							{property.propertyBarter ? 'Barter' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
							<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
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
	} else {
		return (
			<Stack className="trend-card-box" key={property._id} onMouseEnter={handleCardMouseEnter} onMouseLeave={handleCardMouseLeave}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					<div>${property.propertyPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(property._id)}>
						{property.propertyTitle}
					</strong>
					<p className={'desc'}>{property.propertyDesc ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span><AnimatedNumber ref={bedNumberRef} value={property.propertyBeds} duration={2500} delay={0} /> bed</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span><AnimatedNumber ref={roomNumberRef} value={property.propertyRooms} duration={2500} delay={0} /> rooms</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property.propertySquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{property.propertyRent ? 'Rent' : ''} {property.propertyRent && property.propertyBarter && '/'}{' '}
							{property.propertyBarter ? 'Barter' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
							<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
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

export default TrendPropertyCard;
