import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown, CaretDown as CaretDownIcon, GridFour } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [darkMode, setDarkMode] = useState<boolean>(false);
	const [showNotifications, setShowNotifications] = useState<boolean>(false);
	const notificationRef = useRef<HTMLDivElement | null>(null);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/property/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);

		// Load dark mode preference from localStorage
		if (typeof window !== 'undefined') {
			const savedDarkMode = localStorage.getItem('darkMode') === 'true';
			setDarkMode(savedDarkMode);
			if (savedDarkMode) {
				document.documentElement.classList.add('dark-mode');
				document.body.style.backgroundColor = '#0f0f0f';
				document.body.style.color = '#ffffff';
			} else {
				document.body.style.backgroundColor = '#ffffff';
				document.body.style.color = '#212121';
			}
		}
	}, []);

	// Close notifications when clicking outside
	useEffect(() => {
		if (!showNotifications) return;
		const handleClickOutside = (event: MouseEvent) => {
			if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
				setShowNotifications(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showNotifications]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', changeNavbarColor);
			return () => {
				window.removeEventListener('scroll', changeNavbarColor);
			};
		}
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleNavigationClick = () => {
		// Scroll to top immediately when clicking navigation links
		if (typeof window !== 'undefined') {
			// Clear any saved scroll positions
			sessionStorage.removeItem('homepageScrollPosition');
			sessionStorage.removeItem('fromDetailPage');

			// Scroll to top immediately
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'auto',
			});
			// Also set scroll position directly to ensure it works
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const toggleDarkMode = () => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);

		if (typeof window !== 'undefined') {
			localStorage.setItem('darkMode', newDarkMode.toString());

			if (newDarkMode) {
				document.documentElement.classList.add('dark-mode');
				document.body.style.backgroundColor = '#0f0f0f';
				document.body.style.color = '#ffffff';
			} else {
				document.documentElement.classList.remove('dark-mode');
				document.body.style.backgroundColor = '#ffffff';
				document.body.style.color = '#212121';
			}
		}
	};

	const dummyNotifications = [
		{
			id: 1,
			title: 'New buildings available',
			desc: 'We’ve added fresh buildings to the Buildings page. Take a look!',
		},
		{
			id: 2,
			title: 'Saved favorites',
			desc: 'You can now manage your favorite buildings from the Me page.',
		},
	];

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (device == 'mobile') {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<span className={'logo-icon'}>
									<CaretDownIcon size={18} weight="fill" style={{ transform: 'rotate(180deg)', color: '#34d399' }} />
								</span>
								<span className={'logo-text'}>LocoHub</span>
							</Link>
						</Box>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div className={router.pathname === '/' ? 'active' : ''} onClick={handleNavigationClick}>
									{t('Home')}
								</div>
							</Link>
							<Link href={'/property'}>
								<div
									className={router.pathname.startsWith('/property') ? 'active' : ''}
									onClick={handleNavigationClick}
								>
									Buildings
								</div>
							</Link>
							<Link href={'/agent'}>
								<div className={router.pathname.startsWith('/agent') ? 'active' : ''} onClick={handleNavigationClick}>
									{' '}
									Advisors{' '}
								</div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div
										className={router.pathname.startsWith('/mypage') ? 'active' : ''}
										onClick={handleNavigationClick}
									>
										{' '}
										Me{' '}
									</div>
								</Link>
							)}
							<Link href={'/cs'}>
								<div className={router.pathname.startsWith('/cs') ? 'active' : ''} onClick={handleNavigationClick}>
									{' '}
									{t('CS')}{' '}
								</div>
							</Link>
						</Box>
						<Box component={'div'} className={'user-box'}>
							{user?._id ? (
								<>
									<div className={'icon-button'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>
									<div className={'icon-button'}>
										<GridFour size={20} color="#ffffff" weight="regular" />
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<AccountCircleOutlinedIcon />
										<span>
											{t('Login')} / {t('Register')}
										</span>
									</div>
								</Link>
							)}

							<div className={'lan-box'}>
								{user?._id && (
									<div
										className={'icon-button notification-button'}
										onClick={() => setShowNotifications((prev) => !prev)}
										ref={notificationRef}
									>
										<NotificationsOutlinedIcon className={'notification-icon'} />
										{showNotifications && (
											<div className="notification-dropdown">
												{dummyNotifications.map((n) => (
													<div key={n.id} className="notification-item">
														<strong>{n.title}</strong>
														<p>{n.desc}</p>
													</div>
												))}
											</div>
										)}
									</div>
								)}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={12} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{(() => {
											if (lang === 'kr') return <img src={'/img/flag/langkr.png'} alt={'koreanFlag'} />;
											if (lang === 'ru') return <img src={'/img/flag/langru.png'} alt={'russiaFlag'} />;
											if (lang === 'uz') return <img src={'/img/flag/langru.png'} alt={'uzbekFlag'} />;
											return <img src={'/img/flag/langen.png'} alt={'usaFlag'} />;
										})()}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/>
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="kr"
											alt={'koreanFlag'}
										/>
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="ru"
											alt={'russiaFlag'}
										/>
										{t('Russian')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="uz">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="uz"
											alt={'uzbekFlag'}
										/>
										Uzbek
									</MenuItem>
								</StyledMenu>

								<div className={'icon-button dark-mode-button'} onClick={toggleDarkMode}>
									{darkMode ? (
										<LightModeOutlinedIcon className={'dark-mode-icon'} />
									) : (
										<DarkModeOutlinedIcon className={'dark-mode-icon'} />
									)}
								</div>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<span className={'logo-icon'}>
									<CaretDownIcon size={20} weight="fill" style={{ transform: 'rotate(180deg)', color: '#34d399' }} />
								</span>
								<span className={'logo-text'}>LocoHub</span>
							</Link>
						</Box>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div className={router.pathname === '/' ? 'active' : ''} onClick={handleNavigationClick}>
									{t('Home')}
								</div>
							</Link>
							<Link href={'/property'}>
								<div
									className={router.pathname.startsWith('/property') ? 'active' : ''}
									onClick={handleNavigationClick}
								>
									Buildings
								</div>
							</Link>
							<Link href={'/agent'}>
								<div className={router.pathname.startsWith('/agent') ? 'active' : ''} onClick={handleNavigationClick}>
									{' '}
									Advisors{' '}
								</div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div
										className={router.pathname.startsWith('/mypage') ? 'active' : ''}
										onClick={handleNavigationClick}
									>
										{' '}
										Me{' '}
									</div>
								</Link>
							)}
							<Link href={'/cs'}>
								<div className={router.pathname.startsWith('/cs') ? 'active' : ''} onClick={handleNavigationClick}>
									{' '}
									{t('CS')}{' '}
								</div>
							</Link>
						</Box>
						<Box component={'div'} className={'user-box'}>
							{user?._id ? (
								<>
									<div className={'icon-button'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>
									<div className={'icon-button'}>
										<GridFour size={24} color="#ffffff" weight="regular" />
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<AccountCircleOutlinedIcon />
										<span>
											{t('Login')} / {t('Register')}
										</span>
									</div>
								</Link>
							)}

							<div className={'lan-box'}>
								{user?._id && (
									<div
										className={'icon-button notification-button'}
										onClick={() => setShowNotifications((prev) => !prev)}
										ref={notificationRef}
									>
										<NotificationsOutlinedIcon className={'notification-icon'} />
										{showNotifications && (
											<div className="notification-dropdown">
												{dummyNotifications.map((n) => (
													<div key={n.id} className="notification-item">
														<strong>{n.title}</strong>
														<p>{n.desc}</p>
													</div>
												))}
											</div>
										)}
									</div>
								)}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'usaFlag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'usaFlag'} />
										)}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/>
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="uz"
											alt={'koreanFlag'}
										/>
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="ru"
											alt={'russiaFlag'}
										/>
										{t('Russian')}
									</MenuItem>
								</StyledMenu>

								<div className={'icon-button dark-mode-button'} onClick={toggleDarkMode}>
									{darkMode ? (
										<LightModeOutlinedIcon className={'dark-mode-icon'} />
									) : (
										<DarkModeOutlinedIcon className={'dark-mode-icon'} />
									)}
								</div>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
