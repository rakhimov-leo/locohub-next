import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyLocation } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { propertySquare } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';
import GlobeLocation from './GlobeLocation';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: PropertiesInquiry;
	setSearchFilter: any;
	initialInput: PropertiesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.roomsList?.length == 0) {
			delete searchFilter.search.roomsList;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.adultsList?.length == 0) {
			delete searchFilter.search.adultsList;
			router
				.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const propertyLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					// Update filter without page reload
					const newFilter = {
						...searchFilter,
						search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
					};
					setSearchFilter(newFilter);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					// Remove location from filter
					const filteredLocationList = searchFilter?.search?.locationList?.filter((item: string) => item !== value);

					// If locationList is empty, remove it completely to show all properties
					const newSearch = { ...searchFilter.search };
					if (filteredLocationList && filteredLocationList.length > 0) {
						newSearch.locationList = filteredLocationList;
					} else {
						delete newSearch.locationList;
					}

					const newFilter = {
						...searchFilter,
						search: newSearch,
					};
					setSearchFilter(newFilter);
				}

				console.log('propertyLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyLocationSelectHandler:', err);
			}
		},
		[searchFilter, setSearchFilter],
	);

	const propertyRoomSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.roomsList?.includes(number)) {
						// Remove room from filter
						const filteredRoomsList = searchFilter?.search?.roomsList?.filter((item: Number) => item !== number);

						// If roomsList is empty, remove it completely
						const newSearch = { ...searchFilter.search };
						if (filteredRoomsList && filteredRoomsList.length > 0) {
							newSearch.roomsList = filteredRoomsList;
						} else {
							delete newSearch.roomsList;
						}

						const newFilter = {
							...searchFilter,
							search: newSearch,
						};
						setSearchFilter(newFilter);
					} else {
						// Add room to filter
						const newFilter = {
							...searchFilter,
							search: { ...searchFilter.search, roomsList: [...(searchFilter?.search?.roomsList || []), number] },
						};
						setSearchFilter(newFilter);
					}
				} else {
					// Remove all rooms filter
					const newSearch = { ...searchFilter.search };
					delete newSearch.roomsList;
					const newFilter = {
						...searchFilter,
						search: newSearch,
					};
					setSearchFilter(newFilter);
				}

				console.log('propertyRoomSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, propertyRoomSelectHandler:', err);
			}
		},
		[searchFilter, setSearchFilter],
	);

	const propertyOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('propertyOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyAdultsSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.adultsList?.includes(number)) {
						// Remove adult from filter
						const filteredAdultsList = searchFilter?.search?.adultsList?.filter((item: Number) => item !== number);

						// If adultsList is empty, remove it completely
						const newSearch = { ...searchFilter.search };
						if (filteredAdultsList && filteredAdultsList.length > 0) {
							newSearch.adultsList = filteredAdultsList;
						} else {
							delete newSearch.adultsList;
						}

						const newFilter = {
							...searchFilter,
							search: newSearch,
						};
						setSearchFilter(newFilter);
					} else {
						// Add adult to filter
						const newFilter = {
							...searchFilter,
							search: { ...searchFilter.search, adultsList: [...(searchFilter?.search?.adultsList || []), number] },
						};
						setSearchFilter(newFilter);
					}
				} else {
					// Remove all adults filter
					const newSearch = { ...searchFilter.search };
					delete newSearch.adultsList;
					const newFilter = {
						...searchFilter,
						search: newSearch,
					};
					setSearchFilter(newFilter);
				}

				console.log('propertyAdultsSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, propertyAdultsSelectHandler:', err);
			}
		},
		[searchFilter, setSearchFilter],
	);

	const propertySquareHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				// Update filter without page reload
				const newFilter = {
					...searchFilter,
					search: {
						...searchFilter.search,
						squaresRange: { ...searchFilter.search.squaresRange, start: value * 1 },
					},
				};
				setSearchFilter(newFilter);
			} else {
				// Update filter without page reload
				const newFilter = {
					...searchFilter,
					search: {
						...searchFilter.search,
						squaresRange: { ...searchFilter.search.squaresRange, end: value * 1 },
					},
				};
				setSearchFilter(newFilter);
			}
		},
		[searchFilter, setSearchFilter],
	);

	const propertyPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				// Update filter without page reload
				const newFilter = {
					...searchFilter,
					search: {
						...searchFilter.search,
						pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
					},
				};
				setSearchFilter(newFilter);
			} else {
				// Update filter without page reload
				const newFilter = {
					...searchFilter,
					search: {
						...searchFilter.search,
						pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
					},
				};
				setSearchFilter(newFilter);
			}
		},
		[searchFilter, setSearchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/property?input=${JSON.stringify(initialInput)}`,
				`/property?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>PROPERTIES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									const trimmed = searchText.trim();
									const upper = trimmed.toUpperCase();

									// If user types a location name (e.g. seoul, france), map it to locationList filter
									const locationMatch = Object.values(PropertyLocation).find((loc) => loc.toUpperCase() === upper);

									const newSearch = { ...searchFilter.search };

									if (locationMatch) {
										newSearch.locationList = [locationMatch as PropertyLocation];
										delete newSearch.text;
									} else {
										newSearch.text = trimmed;
									}

									setSearchFilter({
										...searchFilter,
										search: newSearch,
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<GlobeLocation
						locations={propertyLocation as PropertyLocation[]}
						selectedLocations={(searchFilter?.search?.locationList || []) as PropertyLocation[]}
						onLocationClick={(location) => {
							const locationList = (searchFilter?.search?.locationList || []) as PropertyLocation[];
							const isSelected = locationList.includes(location);
							try {
								if (isSelected) {
									// Remove location from filter
									const filteredLocationList = locationList.filter((l) => l !== location);

									// If locationList is empty, remove it completely to show all properties
									const newSearch = { ...searchFilter.search };
									if (filteredLocationList.length > 0) {
										newSearch.locationList = filteredLocationList;
									} else {
										delete newSearch.locationList;
									}

									const newFilter = {
										...searchFilter,
										search: newSearch,
									};
									setSearchFilter(newFilter);
								} else {
									// Add location - update filter without page reload
									const newFilter = {
										...searchFilter,
										search: {
											...searchFilter.search,
											locationList: [...locationList, location],
										},
									};
									setSearchFilter(newFilter);
								}
							} catch (err) {
								console.log('ERROR, globe location click:', err);
							}
						}}
					/>
					<Stack
						className={'property-location'}
						style={{ height: showMore ? '400px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{propertyLocation.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="property-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as PropertyLocation)}
										onChange={propertyLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Rooms</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '12px 0 0 12px',
								border: !searchFilter?.search?.roomsList ? '2px solid #181A20' : '1px solid #b9b9b9',
							}}
							onClick={() => propertyRoomSelectHandler(0)}
						>
							Any
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.roomsList?.includes(1) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.roomsList?.includes(1) ? undefined : 'none',
							}}
							onClick={() => propertyRoomSelectHandler(1)}
						>
							1
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.roomsList?.includes(2) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.roomsList?.includes(2) ? undefined : 'none',
							}}
							onClick={() => propertyRoomSelectHandler(2)}
						>
							2
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.roomsList?.includes(3) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.roomsList?.includes(3) ? undefined : 'none',
							}}
							onClick={() => propertyRoomSelectHandler(3)}
						>
							3
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.roomsList?.includes(4) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.roomsList?.includes(4) ? undefined : 'none',
								borderRight: searchFilter?.search?.roomsList?.includes(4) ? undefined : 'none',
							}}
							onClick={() => propertyRoomSelectHandler(4)}
						>
							4
						</Button>
						<Button
							sx={{
								borderRadius: '0 12px 12px 0',
								border: searchFilter?.search?.roomsList?.includes(5) ? '2px solid #181A20' : '1px solid #b9b9b9',
							}}
							onClick={() => propertyRoomSelectHandler(5)}
						>
							5+
						</Button>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Adults</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '12px 0 0 12px',
								border: !searchFilter?.search?.adultsList ? '2px solid #181A20' : '1px solid #b9b9b9',
							}}
							onClick={() => propertyAdultsSelectHandler(0)}
						>
							Any
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.adultsList?.includes(1) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.adultsList?.includes(1) ? undefined : 'none',
							}}
							onClick={() => propertyAdultsSelectHandler(1)}
						>
							1
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.adultsList?.includes(2) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.adultsList?.includes(2) ? undefined : 'none',
							}}
							onClick={() => propertyAdultsSelectHandler(2)}
						>
							2
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.adultsList?.includes(3) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.adultsList?.includes(3) ? undefined : 'none',
							}}
							onClick={() => propertyAdultsSelectHandler(3)}
						>
							3
						</Button>
						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.adultsList?.includes(4) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.adultsList?.includes(4) ? undefined : 'none',
							}}
							onClick={() => propertyAdultsSelectHandler(4)}
						>
							4
						</Button>
						<Button
							sx={{
								borderRadius: '0 12px 12px 0',
								border: searchFilter?.search?.adultsList?.includes(5) ? '2px solid #181A20' : '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.adultsList?.includes(5) ? undefined : 'none',
							}}
							onClick={() => propertyAdultsSelectHandler(5)}
						>
							5+
						</Button>
					</Stack>
				</Stack>
				{/* Options (Barter / Rent) section removed as per design */}
				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									propertyPriceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									propertyPriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
