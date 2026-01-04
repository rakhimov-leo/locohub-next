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

		// Video yuklanishini optimallashtirish (faqat desktop uchun)
		useEffect(() => {
			if (device === 'mobile') return; // Mobile'da video yo'q
			
			const video = videoRef.current;
			if (!video) return;

			let hasPlayed = false; // Video bir marta play qilinganini kuzatish

			// Video'ni darhol play qilish uchun funksiya
			const playVideo = () => {
				if (hasPlayed) return; // Agar allaqachon play qilingan bo'lsa, qayta play qilmaslik
				
				if (video.readyState >= 2) { // HAVE_CURRENT_DATA - minimal data yuklangandan keyin
					video.play().then(() => {
						hasPlayed = true;
					}).catch((err) => {
						console.log('Video play error:', err);
					});
				}
			};

			// Video'ni tezroq ochilishi uchun bir nechta event listener'lar
			const handleLoadedMetadata = () => {
				// Metadata yuklangandan keyin darhol play qilish (eng tez)
				playVideo();
			};

			const handleCanPlay = () => {
				// Video play qilishga tayyor bo'lganda
				playVideo();
			};

			// Event listener'lar qo'shish - birinchi event trigger bo'lganda play qilish
			video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
			video.addEventListener('canplay', handleCanPlay, { once: true });

			// Video yuklanishini tezlashtirish uchun priority qo'shish
			if ('fetchPriority' in video) {
				(video as any).fetchPriority = 'high';
			}

			// Video'ni darhol yuklashni boshlash (preload="none" bo'lsa ham)
			video.load();

			// Agar video allaqachon yuklangan bo'lsa, darhol play qilish
			if (video.readyState >= 2) { // HAVE_CURRENT_DATA
				playVideo();
			}

			return () => {
				video.removeEventListener('loadedmetadata', handleLoadedMetadata);
				video.removeEventListener('canplay', handleCanPlay);
			};
		}, [device]);

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

						<Stack 
							className={'header-main'} 
							style={{ 
								position: 'relative',
								overflow: 'hidden',
								height: '400px',
								backgroundImage: 'url(/img/banner/city-background.jpg)',
								backgroundSize: 'cover',
								backgroundPosition: 'center 30%',
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
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
								preload="none"
							>
								<source src="/video/header-background.webm" type="video/webm" />
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
