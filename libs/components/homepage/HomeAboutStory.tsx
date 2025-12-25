import React from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const HomeAboutStory = () => {
	const device = useDeviceDetect();

	const content = (
		<>
			{/* STORY + PRICING HERO */}
			<Stack className={'intro'}>
				<Stack className={'container'}>
					<Stack className={'left'}>
						<strong>Our Story</strong>
						<p className="headline">Helping travelers find the right stay — at the right price</p>
						<p>LocoHub was built to make hotel and villa discovery simple and transparent for everyday travelers.</p>
						<p>We help people search, compare, and choose stays with clear pricing and verified listings worldwide.</p>
					</Stack>
					<Stack className={'right'}>
						<div className="hero-image">
							<img src="/img/banner/about-rabbit.png" alt="Relaxed guest enjoying a comfortable stay" />
						</div>
						<p className="hero-caption">
							Travel should feel simple, comfortable, and enjoyable. Because finding a stay shouldn't be complicated.
						</p>
					</Stack>
				</Stack>
			</Stack>
		</>
	);

	// Use same layout for mobile/desktop inside home, styles mainly PC but mobile will still show stacked
	return <Stack className={'about-page'}>{content}</Stack>;
};

export default HomeAboutStory;



