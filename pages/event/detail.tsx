import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const eventsData: any = {
	'cannes-film-festival': {
		id: 'cannes-film-festival',
		eventTitle: 'Cannes Film Festival',
		city: 'France',
		description:
			'The world\'s most prestigious film festival held annually in Cannes, France. Experience glamorous red carpet premieres, international cinema, and the iconic Palme d\'Or award ceremony on the French Riviera.',
		imageSrc: '/img/events/France.webg.jpg',
		fullDescription:
			'The Cannes Film Festival, officially known as the Festival de Cannes, is one of the world\'s most prestigious and publicized film festivals. Held annually in Cannes, France, this iconic event attracts the biggest names in cinema, from A-list actors and directors to international film critics and industry professionals. Established in 1946, the festival takes place at the Palais des Festivals et des Congrès, where the famous red carpet stairs lead to glamorous premieres and screenings. The festival is renowned for its prestigious Palme d\'Or award, the highest prize given to the best film in the main competition. Beyond the competition, Cannes features the Marché du Film, the world\'s largest film market, where thousands of films are bought and sold. The festival transforms the beautiful French Riviera town into a global cinema capital every May, with star-studded events, exclusive parties, and world premieres of highly anticipated films. Visitors can experience the glamour of the red carpet, attend film screenings, participate in industry events, and enjoy the stunning Mediterranean setting of Cannes.',
	},
	'venice-film-festival': {
		id: 'venice-film-festival',
		eventTitle: 'Venice Film Festival',
		city: 'Italy',
		description: 'The oldest film festival in the world, held annually in Venice, Italy. Discover groundbreaking cinema, artistic excellence, and the prestigious Golden Lion award in the romantic city of canals.',
		imageSrc: '/img/events/ITALY.jpg',
		fullDescription:
			'The Venice Film Festival, officially known as the Mostra Internazionale d\'Arte Cinematografica di Venezia, is the oldest film festival in the world, first held in 1932. This prestigious event takes place annually on the Lido di Venezia, a beautiful barrier island in the Venetian Lagoon. The festival is organized by La Biennale di Venezia and is part of the Venice Biennale, one of the world\'s oldest and most prestigious cultural exhibitions. The Venice Film Festival is renowned for its focus on artistic and innovative cinema, often premiering films that go on to win major awards including Oscars. The festival\'s highest honor is the Golden Lion (Leone d\'Oro), awarded to the best film in the main competition. The festival takes place in late August and early September, transforming the historic Lido into a hub of international cinema. Visitors can attend world premieres, meet acclaimed filmmakers, participate in industry events, and enjoy the unique atmosphere of Venice. The festival combines the glamour of international cinema with the romantic beauty of one of the world\'s most enchanting cities, creating an unforgettable experience for film lovers and industry professionals alike.',
	},
	'seoul-lantern-festival': {
		id: 'seoul-lantern-festival',
		eventTitle: 'Seoul Lantern Festival',
		city: 'Seoul',
		description: 'Marvel at thousands of beautifully crafted lanterns illuminating the Cheonggyecheon Stream, showcasing Korean traditional culture and modern artistry in the heart of Seoul.',
		imageSrc: '/img/banner/cities/SEOUL.jpg',
		fullDescription:
			'The Seoul Lantern Festival is a magical annual event held in November along the Cheonggyecheon Stream in downtown Seoul, South Korea. This enchanting festival features thousands of beautifully crafted lanterns that transform the 1.2-kilometer stretch of the stream into a luminous wonderland. The lanterns showcase various themes, from traditional Korean folklore and historical figures to modern art installations and international cultural displays. Established to celebrate Korean traditional culture while incorporating contemporary artistic expressions, the festival attracts millions of visitors each year. Visitors can stroll along the stream, admiring intricate lantern sculptures, interactive displays, and stunning light installations. The festival includes special events such as lantern-making workshops where visitors can create their own traditional Korean lanterns, cultural performances featuring traditional music and dance, and various food vendors offering delicious Korean street food. The Seoul Lantern Festival creates a warm and festive atmosphere in the heart of the bustling capital city, providing a perfect blend of traditional Korean heritage and modern urban culture. The festival typically runs for about two weeks, with the lanterns lit every evening, creating a breathtaking spectacle that draws both locals and international tourists.',
	},
};

const EventDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [event, setEvent] = useState<any>(null);

	useEffect(() => {
		if (router.query.id) {
			const eventId = router.query.id as string;
			const foundEvent = eventsData[eventId];
			if (foundEvent) {
				setEvent(foundEvent);
			}
		}
	}, [router.query.id]);

	// Scroll to top on route change
	useEffect(() => {
		const handleRouteChange = () => {
			// Always scroll to top when entering event detail page
			window.scrollTo(0, 0);
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		};

		router.events.on('routeChangeComplete', handleRouteChange);
		
		// Also scroll immediately when component mounts
		window.scrollTo(0, 0);
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	// Scroll to top when event ID changes
	useEffect(() => {
		if (router.query.id) {
			// Force scroll to top using multiple methods
			const scrollToTop = () => {
				window.scrollTo(0, 0);
				document.documentElement.scrollTop = 0;
				document.body.scrollTop = 0;
			};
			
			// Instant scroll to top
			scrollToTop();
			
			// Also scroll after delays to ensure it works after page load
			const timeout1 = setTimeout(scrollToTop, 50);
			const timeout2 = setTimeout(scrollToTop, 200);
			const timeout3 = setTimeout(scrollToTop, 500);

			return () => {
				clearTimeout(timeout1);
				clearTimeout(timeout2);
				clearTimeout(timeout3);
			};
		}
	}, [router.query.id]);

	// Also scroll when event data is loaded
	useEffect(() => {
		if (event) {
			window.scrollTo(0, 0);
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		}
	}, [event]);

	if (!event) {
		return (
			<Stack className="event-detail-page" sx={{ minHeight: '100vh', padding: '40px' }}>
				<Typography>Event not found</Typography>
			</Stack>
		);
	}

	if (device === 'mobile') {
		return (
			<Stack className="event-detail-page" sx={{ minHeight: '100vh', padding: '20px' }}>
				<Box onClick={() => router.back()} sx={{ cursor: 'pointer', marginBottom: '20px' }}>
					<ArrowBackIcon />
				</Box>
				<Box
					component="img"
					src={event.imageSrc}
					alt={event.eventTitle}
					sx={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }}
				/>
				<Typography variant="h4" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
					{event.eventTitle}
				</Typography>
				<Typography variant="h6" sx={{ marginBottom: '20px', color: '#666' }}>
					{event.city}
				</Typography>
				<Typography variant="body1" sx={{ lineHeight: 1.8, marginBottom: '20px' }}>
					{event.fullDescription || event.description}
				</Typography>
			</Stack>
		);
	} else {
		return (
			<Stack id="event-detail-page">
				<Stack className="event-detail-page">
					<Box onClick={() => router.back()} className="back-button">
						<ArrowBackIcon />
						<Typography>Back to Events</Typography>
					</Box>
					<Stack direction="row" spacing={4}>
						<Box
							component="img"
							src={event.imageSrc}
							alt={event.eventTitle}
							className="event-image"
						/>
						<Stack className="event-content">
							<Typography className="event-title">
								{event.eventTitle}
							</Typography>
							<Typography className="event-city">
								{event.city}
							</Typography>
							<Typography className="event-description">
								{event.fullDescription || event.description}
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutFull(EventDetail);

