import React, { useEffect, useRef } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import HeaderFilter from '../homepage/HeaderFilter';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const videoRef = useRef<HTMLVideoElement>(null);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		// Video yuklanishini tezlashtirish - to'liq yuklanmasdan ham ko'rsatish
		useEffect(() => {
			const video = videoRef.current;
			if (!video) return;

			// Video'ni darhol yuklash
			video.load();

			// Video'ni darhol play qilish uchun funksiya
			const playVideo = () => {
				if (video.readyState >= 1) { // HAVE_METADATA - metadata yuklangandan keyin
					video.play().catch((err) => {
						console.log('Video play error:', err);
					});
				}
			};

			// Video metadata yuklangandan keyin darhol play qilish
			const handleLoadedMetadata = () => {
				// Metadata yuklangandan keyin darhol play qilish
				playVideo();
			};

			// Video tayyor bo'lganda play qilish
			const handleCanPlay = () => {
				playVideo();
			};

			// Video birinchi frame yuklangandan keyin play qilish
			const handleLoadedData = () => {
				playVideo();
			};

			// Video'ni darhol play qilishga harakat qilish
			// Agar video allaqachon yuklangan bo'lsa
			if (video.readyState >= 1) {
				playVideo();
			}

			// Event listener'larni qo'shish
			video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
			video.addEventListener('loadeddata', handleLoadedData, { once: true });
			video.addEventListener('canplay', handleCanPlay, { once: true });

			// Video yuklanishini tezlashtirish uchun priority qo'shish
			if ('fetchPriority' in video) {
				(video as any).fetchPriority = 'high';
			}

			// Video'ni darhol play qilishga harakat qilish (timeout bilan)
			const timeout = setTimeout(() => {
				playVideo();
			}, 100);

			return () => {
				clearTimeout(timeout);
				video.removeEventListener('loadedmetadata', handleLoadedMetadata);
				video.removeEventListener('loadeddata', handleLoadedData);
				video.removeEventListener('canplay', handleCanPlay);
			};
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>LocoHub</title>
						<meta name={'title'} content={`LocoHub`} />
						<link rel="preload" href="/video/header-background.mp4" as="video" type="video/mp4" />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack 
							className={'header-main'} 
							style={{ 
								backgroundImage: 'none',
								backgroundColor: '#000'
							}}
						>
							<video 
								ref={videoRef}
								className={'header-background-video'} 
								autoPlay 
								loop 
								muted 
								playsInline
								preload="auto"
							>
								<source src="/video/header-background.mp4" type="video/mp4" />
								Your browser does not support the video tag.
							</video>
							<Stack className={'container'} style={{ position: 'relative', zIndex: 1 }}>
								<HeaderFilter />
							</Stack>
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
						<link rel="preload" href="/video/header-background.mp4" as="video" type="video/mp4" />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack 
							className={'header-main'} 
							style={{ 
								backgroundImage: 'none',
								backgroundColor: '#000'
							}}
						>
							<video 
								ref={videoRef}
								className={'header-background-video'} 
								autoPlay 
								loop 
								muted 
								playsInline
								preload="auto"
							>
								<source src="/video/header-background.mp4" type="video/mp4" />
								Your browser does not support the video tag.
							</video>
							<Stack className={'container'} style={{ position: 'relative', zIndex: 1 }}>
								<HeaderFilter />
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

export default withLayoutMain;
