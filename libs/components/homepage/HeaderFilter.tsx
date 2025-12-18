import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button, Popover } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { propertySquare, propertyYears } from '../../config';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
	initialInput?: PropertiesInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const defaultInput: PropertiesInquiry = {
		page: 1,
		limit: 10,
		search: {},
	};
	const { initialInput = defaultInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
	const locationRef: any = useRef();
	const roomsRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openLocation, setOpenLocation] = useState(false);
	const [openRooms, setOpenRooms] = useState(false);
	const [openCalendar, setOpenCalendar] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const calendarAnchorRef = useRef<HTMLDivElement>(null);
	const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));
	const [yearCheck, setYearCheck] = useState({ start: 1970, end: thisYear });
	const [optionCheck, setOptionCheck] = useState('all');

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) {
				setOpenLocation(false);
			}

			if (!roomsRef?.current?.contains(event.target)) {
				setOpenRooms(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const calendarHandler = () => {
		setOpenCalendar((prev) => !prev);
		setOpenLocation(false);
		setOpenRooms(false);
	};

	const advancedFilterHandler = (status: boolean) => {
		setOpenLocation(false);
		setOpenRooms(false);
		setOpenAdvancedFilter(status);
		setOpenCalendar(false);
	};

	const locationStateChangeHandler = () => {
		setOpenLocation((prev) => !prev);
		setOpenRooms(false);
	};

	const roomStateChangeHandler = () => {
		setOpenRooms((prev) => !prev);
		setOpenLocation(false);
	};

	const disableAllStateHandler = () => {
		setOpenRooms(false);
		setOpenLocation(false);
	};

	const propertyLocationSelectHandler = useCallback(
		async (value: any) => {
			try {
				// Ensure value is a valid PropertyLocation enum value
				const locationValue = value as PropertyLocation;
				if (!Object.values(PropertyLocation).includes(locationValue)) {
					console.error('Invalid location value:', value);
					return;
				}

				// When a location is selected on the homepage,
				// immediately navigate to Hotels page with that location and HOTEL type.
				const updatedFilter: PropertiesInquiry = {
					...searchFilter,
					search: {
						...searchFilter.search,
						locationList: [locationValue],
						typeList: [PropertyType.HOTEL],
					},
				};

				setSearchFilter(updatedFilter);
				setOpenLocation(false);
				disableAllStateHandler();

				await router.push(
					`/property?input=${JSON.stringify(updatedFilter)}`,
					`/property?input=${JSON.stringify(updatedFilter)}`,
					{ scroll: false },
				);
			} catch (err: any) {
				console.log('ERROR, propertyLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyRoomSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						roomsList: [value],
					},
				});
				disableAllStateHandler();
			} catch (err: any) {
				console.log('ERROR, propertyRoomSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyAdultsSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.adultsList?.includes(number)) {
						setSearchFilter({
							...searchFilter,
							search: {
								...searchFilter.search,
								adultsList: searchFilter?.search?.adultsList?.filter((item: Number) => item !== number),
							},
						});
					} else {
						setSearchFilter({
							...searchFilter,
							search: { ...searchFilter.search, adultsList: [...(searchFilter?.search?.adultsList || []), number] },
						});
					}
				} else {
					delete searchFilter?.search.adultsList;
					setSearchFilter({ ...searchFilter });
				}

				console.log('propertyAdultsSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, propertyAdultsSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;
				setOptionCheck(value);

				if (value !== 'all') {
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
							options: [value],
						},
					});
				} else {
					delete searchFilter.search.options;
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					});
				}
			} catch (err: any) {
				console.log('ERROR, propertyOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const yearStartChangeHandler = async (event: any) => {
		setYearCheck({ ...yearCheck, start: Number(event.target.value) });

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				periodsRange: { start: Number(event.target.value), end: yearCheck.end },
			},
		});
	};

	const yearEndChangeHandler = async (event: any) => {
		setYearCheck({ ...yearCheck, end: Number(event.target.value) });

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				periodsRange: { start: yearCheck.start, end: Number(event.target.value) },
			},
		});
	};

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
		setYearCheck({ start: 1970, end: thisYear });
	};

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.locationList?.length == 0) {
				delete searchFilter.search.locationList;
			}

			if (searchFilter?.search?.roomsList?.length == 0) {
				delete searchFilter.search.roomsList;
			}

			if (searchFilter?.search?.options?.length == 0) {
				delete searchFilter.search.options;
			}

			if (searchFilter?.search?.adultsList?.length == 0) {
				delete searchFilter.search.adultsList;
			}

			await router.push(
				`/property?input=${JSON.stringify(searchFilter)}`,
				`/property?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return (
			<>
				<Stack className={'hero-content'}>
					<Stack className={'hero-headline'}>
						<Box component={'span'} className={'hero-subtitle'}>
							Find Your Perfect Stay with
						</Box>
						<Box component={'h1'} className={'hero-title'}>
							LocoHub.
						</Box>
					</Stack>
				</Stack>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box
							component={'div'}
							className={`box location-box ${openLocation ? 'on' : ''}`}
							onClick={locationStateChangeHandler}
						>
							<LocationOnIcon className="location-icon" />
							<span className="location-text">
								{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : 'Select Destination'}
							</span>
							<ExpandMoreIcon className="dropdown-icon" />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} ref={calendarAnchorRef} onClick={calendarHandler}>
							<CalendarTodayIcon className="calendar-icon" />
							{selectedDate && (
								<span className="date-text">
									{selectedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
								</span>
							)}
						</Box>
						<Popover
							open={openCalendar}
							anchorEl={calendarAnchorRef.current}
							onClose={() => setOpenCalendar(false)}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
						>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<Box
									sx={{
										p: 2,
										'& .MuiPickersLayout-root': { width: 'auto' },
										'& .MuiDateCalendar-root': { width: '280px' },
										'& .MuiPickersCalendarHeader-root': {
											paddingLeft: '12px',
											paddingRight: '12px',
											marginBottom: '12px',
										},
										'& .MuiPickersCalendarHeader-label': {
											fontSize: '14px',
											fontWeight: 600,
										},
										'& .MuiDayCalendar-weekContainer': {
											margin: 0,
										},
										'& .MuiPickersDay-root': {
											width: '36px',
											height: '36px',
											fontSize: '13px',
											margin: '3px',
											fontWeight: 500,
										},
										'& .MuiPickersCalendarHeader-switchViewButton': {
											width: '36px',
											height: '36px',
										},
										'& .MuiDayCalendar-weekDayLabel': {
											fontSize: '12px',
											fontWeight: 600,
											width: '36px',
											margin: '3px',
										},
									}}
								>
									<StaticDatePicker
										value={selectedDate}
										onChange={(newValue) => {
											setSelectedDate(newValue);
											if (newValue) {
												setOpenCalendar(false);
											}
										}}
										renderInput={(params: any) => <div />}
									/>
								</Box>
							</LocalizationProvider>
						</Popover>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
							<span>Search</span>
						</Box>
					</Stack>

					{/*MENU */}
					{openLocation && <div className="filter-location-overlay" onClick={() => setOpenLocation(false)}></div>}
					<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
						{propertyLocation.map((location: string, index: number) => {
							return (
								<div
									className="location-item"
									style={{ animationDelay: `${index * 0.08}s` }}
									onClick={() => propertyLocationSelectHandler(location)}
									key={location}
								>
									<img src={`img/banner/cities/${location}.jpg`} alt="" />
									<span>{location}</span>
								</div>
							);
						})}
					</div>
				</Stack>

				{/* ADVANCED FILTER MODAL */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Find your home</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>adults</span>
										<div className={'inside'}>
											<div
												className={`room ${!searchFilter?.search?.adultsList ? 'active' : ''}`}
												onClick={() => propertyAdultsSelectHandler(0)}
											>
												Any
											</div>
											{[1, 2, 3, 4, 5].map((adult: number) => (
												<div
													className={`room ${searchFilter?.search?.adultsList?.includes(adult) ? 'active' : ''}`}
													onClick={() => propertyAdultsSelectHandler(adult)}
													key={adult}
												>
													{adult == 0 ? 'Any' : adult}
												</div>
											))}
										</div>
									</div>
									{/* Options (Barter / Rent) filter removed as per design */}
								</div>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Year Built</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.start.toString()}
													onChange={yearStartChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{propertyYears?.slice(0)?.map((year: number) => (
														<MenuItem value={year} disabled={yearCheck.end <= year} key={year}>
															{year}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.end.toString()}
													onChange={yearEndChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{propertyYears
														?.slice(0)
														.reverse()
														.map((year: number) => (
															<MenuItem value={year} disabled={yearCheck.start >= year} key={year}>
																{year}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	} else {
		return (
			<>
				<Stack className={'hero-content'}>
					<Stack className={'hero-headline'}>
						<Box component={'span'} className={'hero-subtitle'}>
							Find Your Perfect Stay with
						</Box>
						<Box component={'h1'} className={'hero-title'}>
							LocoHub.
						</Box>
					</Stack>
				</Stack>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box
							component={'div'}
							className={`box location-box ${openLocation ? 'on' : ''}`}
							onClick={locationStateChangeHandler}
						>
							<LocationOnIcon className="location-icon" />
							<span className="location-text">
								{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : 'Select Destination'}
							</span>
							<ExpandMoreIcon className="dropdown-icon" />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} ref={calendarAnchorRef} onClick={calendarHandler}>
							<CalendarTodayIcon className="calendar-icon" />
							{selectedDate && (
								<span className="date-text">
									{selectedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
								</span>
							)}
						</Box>
						<Popover
							open={openCalendar}
							anchorEl={calendarAnchorRef.current}
							onClose={() => setOpenCalendar(false)}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
						>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<Box
									sx={{
										p: 2,
										'& .MuiPickersLayout-root': { width: 'auto' },
										'& .MuiDateCalendar-root': { width: '320px' },
										'& .MuiPickersCalendarHeader-root': {
											paddingLeft: '16px',
											paddingRight: '16px',
											marginBottom: '16px',
										},
										'& .MuiPickersCalendarHeader-label': {
											fontSize: '16px',
											fontWeight: 600,
										},
										'& .MuiDayCalendar-weekContainer': {
											margin: 0,
										},
										'& .MuiPickersDay-root': {
											width: '40px',
											height: '40px',
											fontSize: '14px',
											margin: '4px',
											fontWeight: 500,
										},
										'& .MuiPickersCalendarHeader-switchViewButton': {
											width: '40px',
											height: '40px',
										},
										'& .MuiDayCalendar-weekDayLabel': {
											fontSize: '13px',
											fontWeight: 600,
											width: '40px',
											margin: '4px',
										},
									}}
								>
									<StaticDatePicker
										value={selectedDate}
										onChange={(newValue) => {
											setSelectedDate(newValue);
											if (newValue) {
												setOpenCalendar(false);
											}
										}}
										renderInput={(params: any) => <div />}
									/>
								</Box>
							</LocalizationProvider>
						</Popover>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
							<span>Search</span>
						</Box>
					</Stack>

					{/*MENU */}
					{openLocation && <div className="filter-location-overlay" onClick={() => setOpenLocation(false)}></div>}
					<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
						{propertyLocation.map((location: string, index: number) => {
							return (
								<div
									className="location-item"
									style={{ animationDelay: `${index * 0.08}s` }}
									onClick={() => propertyLocationSelectHandler(location)}
									key={location}
								>
									<img src={`img/banner/cities/${location}.jpg`} alt="" />
									<span>{location}</span>
								</div>
							);
						})}
					</div>
				</Stack>

				{/* ADVANCED FILTER MODAL */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Find your home</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>adults</span>
										<div className={'inside'}>
											<div
												className={`room ${!searchFilter?.search?.adultsList ? 'active' : ''}`}
												onClick={() => propertyAdultsSelectHandler(0)}
											>
												Any
											</div>
											{[1, 2, 3, 4, 5].map((adult: number) => (
												<div
													className={`room ${searchFilter?.search?.adultsList?.includes(adult) ? 'active' : ''}`}
													onClick={() => propertyAdultsSelectHandler(adult)}
													key={adult}
												>
													{adult == 0 ? 'Any' : adult}
												</div>
											))}
										</div>
									</div>
									<div className={'box'}>
										<span>options</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={optionCheck}
													onChange={propertyOptionSelectHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value={'all'}>All Options</MenuItem>
													<MenuItem value={'propertyBarter'}>Barter</MenuItem>
													<MenuItem value={'propertyRent'}>Rent</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Year Built</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.start.toString()}
													onChange={yearStartChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{propertyYears?.slice(0)?.map((year: number) => (
														<MenuItem value={year} disabled={yearCheck.end <= year} key={year}>
															{year}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.end.toString()}
													onChange={yearEndChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{propertyYears
														?.slice(0)
														.reverse()
														.map((year: number) => (
															<MenuItem value={year} disabled={yearCheck.start >= year} key={year}>
																{year}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default HeaderFilter;
