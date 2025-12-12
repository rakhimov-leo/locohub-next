import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Select,
	FormControl,
	InputLabel,
	Box,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Property } from '../../../types/property/property';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import { sweetErrorAlert, sweetMixinSuccessAlert, sweetErrorHandling } from '../../../sweetAlert';
import { PropertyStatus, PropertyType, PropertyLocation } from '../../../enums/property.enum';
import { PropertyUpdate } from '../../../types/property/property.update';

interface Data {
	id: string;
	title: string;
	price: string;
	agent: string;
	location: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENT',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
	{
		id: 'action' as any,
		numeric: false,
		disablePadding: false,
		label: 'ACTION',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface PropertyPanelListType {
	properties: Property[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updatePropertyHandler: any;
	removePropertyHandler: any;
	onPropertyUpdated?: () => Promise<void> | void;
}

export const PropertyPanelList = (props: PropertyPanelListType) => {
	const {
		properties,
		anchorEl,
		menuIconClickHandler,
		menuIconCloseHandler,
		updatePropertyHandler,
		removePropertyHandler,
		onPropertyUpdated,
	} = props;
	
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editingProperty, setEditingProperty] = useState<Property | null>(null);
	const [editData, setEditData] = useState<PropertyUpdate>({
		_id: '',
		propertyTitle: '',
		propertyPrice: 0,
		propertyType: PropertyType.HOUSE,
		propertyLocation: PropertyLocation.FRANCE,
		propertyAddress: '',
		propertyBarter: false,
		propertyRent: false,
		propertyRooms: 0,
		propertyBeds: 0,
		propertySquare: 0,
		propertyDesc: '',
	});

	const handleEditClick = (property: Property) => {
		setEditingProperty(property);
		setEditData({
			_id: property._id,
			propertyTitle: property.propertyTitle,
			propertyPrice: property.propertyPrice,
			propertyType: property.propertyType,
			propertyLocation: property.propertyLocation,
			propertyAddress: property.propertyAddress,
			propertyBarter: property.propertyBarter,
			propertyRent: property.propertyRent,
			propertyRooms: property.propertyRooms,
			propertyBeds: property.propertyBeds,
			propertySquare: property.propertySquare,
			propertyDesc: property.propertyDesc || '',
		});
		setEditDialogOpen(true);
	};

	const handleEditClose = () => {
		setEditDialogOpen(false);
		setEditingProperty(null);
	};

	const handleEditSave = async () => {
		try {
			console.log('Saving edit data:', editData);
			// Ensure _id is included
			if (!editData._id) {
				throw new Error('Property ID is required');
			}
			
			// Build update data object, only including defined fields
			// Filter out undefined, null (for strings), and empty strings to avoid validation errors
			const graphqlUpdateData: any = {
				_id: editData._id,
			};
			
			// Add fields only if they are defined and have valid values
			if (editData.propertyTitle !== undefined && editData.propertyTitle !== null && editData.propertyTitle !== '') {
				graphqlUpdateData.propertyTitle = editData.propertyTitle;
			}
			if (editData.propertyPrice !== undefined && editData.propertyPrice !== null && editData.propertyPrice >= 0) {
				graphqlUpdateData.propertyPrice = editData.propertyPrice;
			}
			if (editData.propertyType !== undefined && editData.propertyType !== null) {
				graphqlUpdateData.propertyType = editData.propertyType;
			}
			if (editData.propertyLocation !== undefined && editData.propertyLocation !== null) {
				graphqlUpdateData.propertyLocation = editData.propertyLocation;
			}
			if (editData.propertyAddress !== undefined && editData.propertyAddress !== null && editData.propertyAddress !== '') {
				graphqlUpdateData.propertyAddress = editData.propertyAddress;
			}
			if (editData.propertyRooms !== undefined && editData.propertyRooms !== null && editData.propertyRooms >= 0) {
				graphqlUpdateData.propertyRooms = editData.propertyRooms;
			}
			if (editData.propertySquare !== undefined && editData.propertySquare !== null && editData.propertySquare >= 0) {
				graphqlUpdateData.propertySquare = editData.propertySquare;
			}
			// Backend is now fixed - use correct field names
			if (editData.propertyBeds !== undefined && editData.propertyBeds !== null && editData.propertyBeds >= 0) {
				graphqlUpdateData.propertyBeds = editData.propertyBeds;
			}
			if (editData.propertyBarter !== undefined && editData.propertyBarter !== null) {
				graphqlUpdateData.propertyBarter = editData.propertyBarter;
			}
			if (editData.propertyRent !== undefined && editData.propertyRent !== null) {
				graphqlUpdateData.propertyRent = editData.propertyRent;
			}
			// Only add propertyDesc if it's not empty
			if (editData.propertyDesc !== undefined && editData.propertyDesc !== null && editData.propertyDesc !== '') {
				graphqlUpdateData.propertyDesc = editData.propertyDesc;
			}
			
			// Remove any remaining empty strings or null values
			Object.keys(graphqlUpdateData).forEach(key => {
				if (graphqlUpdateData[key] === '' || graphqlUpdateData[key] === null || graphqlUpdateData[key] === undefined) {
					delete graphqlUpdateData[key];
				}
			});
			
			console.log('GraphQL update data to send:', JSON.stringify(graphqlUpdateData, null, 2));
			
			// Call update handler which will refetch the data
			await updatePropertyHandler(graphqlUpdateData);
			
			// Show success message
			await sweetMixinSuccessAlert('Property updated successfully');
			
			// Close dialog
			handleEditClose();
			
			// Additional refetch via callback if provided
			if (onPropertyUpdated) {
				await onPropertyUpdated();
			}
		} catch (err: any) {
			console.error('Error saving property:', err);
			console.error('Error details:', {
				message: err.message,
				graphQLErrors: err.graphQLErrors,
				networkError: err.networkError,
				fullError: err,
			});
			
			// Display more detailed error message
			let errorMessage = 'Failed to update property';
			if (err.graphQLErrors && err.graphQLErrors.length > 0) {
				errorMessage = err.graphQLErrors.map((e: any) => e.message).join(', ');
			} else if (err.message) {
				errorMessage = err.message;
			}
			
			await sweetErrorAlert(errorMessage);
		}
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{properties.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={9}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{properties.length !== 0 &&
							properties.map((property: Property, index: number) => {
								const propertyImage = `${REACT_APP_API_URL}/${property?.propertyImages[0]}`;

								return (
									<TableRow hover key={property?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{property._id}</TableCell>
										<TableCell align="left" className={'name'}>
											{property.propertyStatus === PropertyStatus.ACTIVE ? (
												<Stack direction={'row'}>
													<Link href={`/property/detail?id=${property?._id}`}>
														<div>
															<Avatar alt="Remy Sharp" src={propertyImage} sx={{ ml: '2px', mr: '10px' }} />
														</div>
													</Link>
													<Link href={`/property/detail?id=${property?._id}`}>
														<div>{property.propertyTitle}</div>
													</Link>
												</Stack>
											) : (
												<Stack direction={'row'}>
													<div>
														<Avatar alt="Remy Sharp" src={propertyImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{ marginTop: '10px' }}>{property.propertyTitle}</div>
												</Stack>
											)}
										</TableCell>
										<TableCell align="center">{property.propertyPrice}</TableCell>
										<TableCell align="center">{property.memberData?.memberNick}</TableCell>
										<TableCell align="center">{property.propertyLocation}</TableCell>
										<TableCell align="center">{property.propertyType}</TableCell>
										<TableCell align="center">
											{property.propertyStatus === PropertyStatus.DELETE && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removePropertyHandler(property._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{property.propertyStatus === PropertyStatus.SOLD && (
												<Button className={'badge warning'}>{property.propertyStatus}</Button>
											)}

											{property.propertyStatus === PropertyStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{property.propertyStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(PropertyStatus)
															.filter((ele) => ele !== property.propertyStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updatePropertyHandler({ _id: property._id, propertyStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
										<TableCell align="center">
											<Button
												variant="outlined"
												startIcon={<EditIcon />}
												onClick={() => handleEditClick(property)}
												sx={{
													p: '6px 16px',
													borderColor: '#1976d2',
													color: '#1976d2',
													'&:hover': {
														borderColor: '#1565c0',
														backgroundColor: 'rgba(25, 118, 210, 0.04)',
													},
												}}
											>
												Edit
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Edit Dialog */}
			<Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
				<DialogTitle>Edit Property</DialogTitle>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 1 }}>
						<TextField
							label="Title"
							fullWidth
							value={editData.propertyTitle}
							onChange={(e) => setEditData({ ...editData, propertyTitle: e.target.value })}
						/>
						{/* @ts-ignore */}
						<Box sx={{ display: 'flex', gap: 2 }}>
							<TextField
								label="Price"
								type="number"
								fullWidth
								value={editData.propertyPrice}
								onChange={(e) => setEditData({ ...editData, propertyPrice: parseInt(e.target.value) || 0 })}
							/>
							<FormControl fullWidth>
								<InputLabel>Type</InputLabel>
								<Select
									value={editData.propertyType}
									label="Type"
									onChange={(e) => setEditData({ ...editData, propertyType: e.target.value as PropertyType })}
								>
									{Object.values(PropertyType).map((type) => (
										<MenuItem key={type} value={type}>
											{type}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<FormControl fullWidth>
								<InputLabel>Location</InputLabel>
								<Select
									value={editData.propertyLocation}
									label="Location"
									onChange={(e) => setEditData({ ...editData, propertyLocation: e.target.value as PropertyLocation })}
								>
									{Object.values(PropertyLocation).map((location) => (
										<MenuItem key={location} value={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<TextField
								label="Address"
								fullWidth
								value={editData.propertyAddress}
								onChange={(e) => setEditData({ ...editData, propertyAddress: e.target.value })}
							/>
						</Box>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<TextField
								label="Rooms"
								type="number"
								fullWidth
								value={editData.propertyRooms}
								onChange={(e) => setEditData({ ...editData, propertyRooms: parseInt(e.target.value) || 0 })}
							/>
							<TextField
								label="Beds"
								type="number"
								fullWidth
								value={editData.propertyBeds}
								onChange={(e) => setEditData({ ...editData, propertyBeds: parseInt(e.target.value) || 0 })}
							/>
							<TextField
								label="Square (m²)"
								type="number"
								fullWidth
								value={editData.propertySquare}
								onChange={(e) => setEditData({ ...editData, propertySquare: parseInt(e.target.value) || 0 })}
							/>
						</Box>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<FormControl fullWidth>
								<InputLabel>Barter</InputLabel>
								<Select
									value={editData.propertyBarter ? 'yes' : 'no'}
									label="Barter"
									onChange={(e) => setEditData({ ...editData, propertyBarter: e.target.value === 'yes' })}
								>
									<MenuItem value="yes">Yes</MenuItem>
									<MenuItem value="no">No</MenuItem>
								</Select>
							</FormControl>
							<FormControl fullWidth>
								<InputLabel>Rent</InputLabel>
								<Select
									value={editData.propertyRent ? 'yes' : 'no'}
									label="Rent"
									onChange={(e) => setEditData({ ...editData, propertyRent: e.target.value === 'yes' })}
								>
									<MenuItem value="yes">Yes</MenuItem>
									<MenuItem value="no">No</MenuItem>
								</Select>
							</FormControl>
						</Box>
						<TextField
							label="Description"
							fullWidth
							multiline
							rows={4}
							value={editData.propertyDesc}
							onChange={(e) => setEditData({ ...editData, propertyDesc: e.target.value })}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleEditClose}>Cancel</Button>
					<Button onClick={handleEditSave} variant="contained" color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
};
