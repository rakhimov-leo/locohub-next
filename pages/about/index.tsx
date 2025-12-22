import React from 'react';
import { NextPage } from 'next';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';

const About: NextPage = () => {
	const device = useDeviceDetect();
	const isMobile = device === 'mobile';

	return (
		<Stack className="about-page">
			{/* STORY + HERO */}
			<Stack className="intro">
				<Stack className="container">
					<Stack className="left">
						<strong>Our Story</strong>
						<p className="headline">Helping travelers find the right stay — at the right price</p>
						<p>LocoHub was built to make hotel and villa discovery simple and transparent for everyday travelers.</p>
						<p>We help people search, compare, and choose stays with clear pricing and verified listings worldwide.</p>
					</Stack>

					<Stack className="right">
						<Box className="hero-image">
							<img
								src="/img/banner/about-rabbit.png"
								alt="Relaxed dog in hotel-style robe"
								loading={isMobile ? 'lazy' : 'eager'}
							/>
						</Box>
						<p className="hero-caption">
							Travel should feel simple, comfortable, and enjoyable. Because finding a stay shouldn’t be complicated.
						</p>
					</Stack>
				</Stack>
			</Stack>

			{/* WHAT MAKES US DIFFERENT */}
			<Stack className="difference">
				<Stack className="container">
					<h2>What Makes Us Different</h2>
					<p className="subtitle">Built on principles that guide everything we do</p>

					<Stack className="cards">
						<Box className="card">
							<div className="icon">
								<img src="/img/icons/security.svg" alt="Verified icon" />
							</div>
							<strong>Verified Hotels & Villas</strong>
							<p>Every listing is checked so you can book with confidence.</p>
						</Box>

						<Box className="card">
							<div className="icon">
								<img src="/img/icons/discovery.svg" alt="Pricing icon" />
							</div>
							<strong>Compare Prices Easily</strong>
							<p>See prices side-by-side with no hidden fees.</p>
						</Box>

						<Box className="card">
							<div className="icon">
								<img src="/img/icons/investment.svg" alt="Global icon" />
							</div>
							<strong>Global Destinations</strong>
							<p>Discover stays across popular cities and emerging spots.</p>
						</Box>
					</Stack>
				</Stack>
			</Stack>

			{/* CTA */}
			<Stack className="help">
				<Stack className="container">
					<Box className="left">
						<strong>Ready to find your next stay?</strong>
						<p>Browse hotels and villas on LocoHub and compare prices in seconds.</p>
					</Box>

					<Box className="right">
						<a href="/property">
							<div className="white">Browse Hotels</div>
						</a>
						<a href="/property">
							<div className="black">Search by Price</div>
						</a>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(About);
