import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '',
				bgVideo = '',
				videoHeight = '100%',
				videoPosition = 'center center',
				headerHeight = '557px';

			switch (router.pathname) {
				case '/property':
					title = 'Hotels Search';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/city-background.jpg';
					headerHeight = '550px';
					break;
				case '/property/detail':
					title = 'Property Details';
					desc = 'Discover your perfect stay';
					bgImage = '/img/banner/city-background.jpg';
					headerHeight = '550px';
					break;
				case '/agent':
					title = 'Advisors';
					bgImage = '/img/banner/city-background.jpg';
					headerHeight = '550px';
					break;
				case '/agent/detail':
					title = 'Agent Page';
					desc = 'Settings';
					bgImage = '/img/banner/city-background.jpg';
					headerHeight = '550px';
					break;
				case '/mypage':
					title = 'Me';
					desc = '';
					bgImage = '/img/banner/city-background.jpg';
					headerHeight = '550px';
					break;
				case '/about':
					title = 'About us';
					desc = '';
					bgImage = '/img/banner/city-background.jpg';
					headerHeight = '550px';
					break;
				case '/cs':
					title = 'CS';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/city-background.jpg';
					headerHeight = '550px';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/city-background.jpg';
					headerHeight = '520px';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Home / For Rent';
					bgImage = '/img/banner/header1.svg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage, bgVideo, videoHeight, videoPosition, headerHeight };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>LocoHub</title>
						<meta name={'title'} content={`LocoHub`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>LocoHub</title>
						<meta name={'title'} content={`LocoHub`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								position: 'relative',
								overflow: 'hidden',
								height: memoizedValues.headerHeight,
								backgroundImage: memoizedValues.bgVideo ? 'none' : `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center 30%',
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							{memoizedValues.bgVideo && (
								<video
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: memoizedValues.videoHeight,
										objectFit: 'cover',
										objectPosition: memoizedValues.videoPosition,
										zIndex: 0,
										pointerEvents: 'none',
									}}
									autoPlay
									loop
									muted
									playsInline
									preload="auto"
								>
									<source src={memoizedValues.bgVideo} type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							)}
							<Stack
								className={'container'}
								style={{
									position: 'relative',
									zIndex: 1,
								}}
							>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
