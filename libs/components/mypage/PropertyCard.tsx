import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import Moment from 'react-moment';
import { Property } from '../../types/property/property';
import { PropertyStatus } from '../../enums/property.enum';
import { formatterStr } from '../../utils';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../config';

interface PropertyCardProps {
	property: Property;
	deletePropertyHandler?: any;
	memberPage?: boolean;
	updatePropertyHandler?: any;
}

export const PropertyCard = (props: PropertyCardProps) => {
	const { property, deletePropertyHandler, memberPage, updatePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditProperty = async (id: string) => {
		console.log('+pushEditProperty: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addProperty', propertyId: id },
		});
	};

	const pushPropertyDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/property/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return (
			<Stack
				style={{
					marginBottom: '16px',
					borderRadius: '12px',
					overflow: 'hidden',
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
					backgroundColor: '#fff',
				}}
			>
				<div
					onClick={() => pushPropertyDetail(property?._id)}
					style={{
						width: '100%',
						height: '200px',
						backgroundImage: `url(${REACT_APP_API_URL}/${property.propertyImages[0]})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						position: 'relative',
						cursor: 'pointer',
					}}
				/>
				<Stack style={{ padding: '16px' }}>
					<Stack style={{ marginBottom: '8px' }} onClick={() => pushPropertyDetail(property?._id)}>
						<Typography sx={{ fontSize: 16, fontWeight: 600, mb: 0.5 }}>{property.propertyTitle}</Typography>
						<Typography sx={{ fontSize: 12, color: '#6b7280', mb: 0.5 }}>{property.propertyAddress}</Typography>
						<Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
							${formatterStr(property?.propertyPrice)} / night
						</Typography>
					</Stack>
					<Stack direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: '8px' }}>
						<Typography sx={{ fontSize: 11, color: '#6b7280' }}>
							<Moment format="DD MMM, YYYY">{property.createdAt}</Moment>
						</Typography>
						<div
							style={{
								paddingLeft: '8px',
								paddingRight: '8px',
								paddingTop: '4px',
								paddingBottom: '4px',
								borderRadius: '6px',
								backgroundColor: '#E5F0FD',
							}}
						>
							<Typography sx={{ fontSize: 11, color: '#3554d1', fontWeight: 500 }}>
								{property.propertyStatus}
							</Typography>
						</div>
					</Stack>
					{!memberPage && property.propertyStatus === PropertyStatus.ACTIVE && (
						<Stack direction="row" spacing={1} style={{ marginTop: '12px' }}>
							<IconButton size="small" onClick={() => pushEditProperty(property._id)} style={{ flex: 1 }}>
								<ModeIcon fontSize="small" />
								<Typography sx={{ ml: 0.5, fontSize: 12 }}>Edit</Typography>
							</IconButton>
							<IconButton size="small" onClick={() => deletePropertyHandler?.(property._id)} style={{ flex: 1 }}>
								<DeleteIcon fontSize="small" />
								<Typography sx={{ ml: 0.5, fontSize: 12 }}>Delete</Typography>
							</IconButton>
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="property-card-box">
				<Stack className="image-box" onClick={() => pushPropertyDetail(property?._id)}>
					<img src={`${REACT_APP_API_URL}/${property.propertyImages[0]}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushPropertyDetail(property?._id)}>
					<Typography className="name">{property.propertyTitle}</Typography>
					<Typography className="address">{property.propertyAddress}</Typography>
					<Typography className="price">
						<strong>${formatterStr(property?.propertyPrice)} / night</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{property.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{property.propertyStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && property.propertyStatus !== 'SOLD' && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{property.propertyStatus === 'ACTIVE' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updatePropertyHandler(PropertyStatus.SOLD, property?._id);
									}}
								>
									Sold
								</MenuItem>
							</>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{property.propertyViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && property.propertyStatus === PropertyStatus.ACTIVE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditProperty(property._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deletePropertyHandler(property._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
	}
};
