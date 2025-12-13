import React from 'react';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventData {
	id: string;
	eventTitle: string;
	city: string;
	description: string;
	imageSrc: string;
}
const eventsData: EventData[] = [
	{
		id: 'cannes-film-festival',
		eventTitle: 'Cannes Film Festival',
		city: 'France',
		description:
			'The world\'s most prestigious film festival held annually in Cannes, France. Experience glamorous red carpet premieres, international cinema, and the iconic Palme d\'Or award ceremony on the French Riviera.',
		imageSrc: '/img/events/France.webg.jpg',
	},
	{
		id: 'venice-film-festival',
		eventTitle: 'Venice Film Festival',
		city: 'Italy',
		description: 'The oldest film festival in the world, held annually in Venice, Italy. Discover groundbreaking cinema, artistic excellence, and the prestigious Golden Lion award in the romantic city of canals.',
		imageSrc: '/img/events/ITALY.jpg',
	},
	{
		id: 'seoul-lantern-festival',
		eventTitle: 'Seoul Lantern Festival',
		city: 'Seoul',
		description: 'Marvel at thousands of beautifully crafted lanterns illuminating the Cheonggyecheon Stream, showcasing Korean traditional culture and modern artistry in the heart of Seoul.',
		imageSrc: '/img/banner/cities/SEOUL.jpg',
	},
];

const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		// Save scroll position before navigating (always save if we're on homepage)
		if (typeof window !== 'undefined') {
			const currentPath = window.location.pathname;
			if (currentPath === '/' || currentPath.startsWith('/?')) {
				const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
				sessionStorage.setItem('homepageScrollPosition', scrollY.toString());
				sessionStorage.setItem('fromDetailPage', 'true');
				console.log('Event: Saved scroll position:', scrollY);
			}
		}
		// Prevent default scroll behavior
		e.preventDefault();
		router.push(
			{
				pathname: '/event/detail',
				query: { id: event?.id },
			},
			undefined,
			{ scroll: false }
		);
	};

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Link
				href={{
					pathname: '/event/detail',
					query: { id: event?.id },
				}}
				onClick={handleLinkClick}
			>
				<Stack
					className="event-card"
					style={{
						backgroundImage: `url(${event?.imageSrc})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						cursor: 'pointer',
					}}
				>
					<Box component={'div'} className={'info'}>
						<strong>{event?.city}</strong>
						<span>{event?.eventTitle}</span>
					</Box>
					<Box component={'div'} className={'more'}>
						<span>{event?.description}</span>
					</Box>
				</Stack>
			</Link>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'white'}>Events</span>
							<p className={'white'}>Events waiting your attention!</p>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
						{eventsData.map((event: EventData) => {
							return <EventCard event={event} key={event?.eventTitle} />;
						})}
					</Stack>
					<Stack className={'footer-text'}>
						<p>Keep Yourself Up To Date</p>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Events;
