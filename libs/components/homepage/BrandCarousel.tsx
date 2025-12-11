import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface BrandItem {
	id: string;
	name: string;
	logo: string;
	link?: string;
}

// Brand items with real links
const brandItems: BrandItem[] = [
	{ id: '1', name: 'Amazon', logo: '/img/icons/brands/amazon.svg', link: 'https://www.amazon.com' },
	{ id: '2', name: 'AMD', logo: '/img/icons/brands/amd.svg', link: 'https://www.amd.com' },
	{ id: '3', name: 'Cisco', logo: '/img/icons/brands/cisco.svg', link: 'https://www.cisco.com' },
	{ id: '4', name: 'Dropcam', logo: '/img/icons/brands/dropcam.svg', link: 'https://www.dropcam.com' },
	{ id: '5', name: 'Logitech', logo: '/img/icons/brands/logitech.svg', link: 'https://www.logitech.com' },
	{ id: '6', name: 'Spotify', logo: '/img/icons/brands/spotify.svg', link: 'https://www.spotify.com' },
];

const BrandCarousel: React.FC = () => {
	const device = useDeviceDetect();
	const [isHovered, setIsHovered] = useState(false);

	if (device === 'mobile') {
		return (
			<Stack className="brand-carousel-container">
				<Box 
					className="brand-carousel-wrapper"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<Box className={`brand-carousel-track ${isHovered ? 'paused' : ''}`}>
						{brandItems.map((brand, index) => (
							<Box key={`${brand.id}-${index}`} className="brand-item">
								{brand.link ? (
									<a href={brand.link} target="_blank" rel="noopener noreferrer" className="brand-link">
										<img src={brand.logo} alt={brand.name} />
										<span>{brand.name}</span>
									</a>
								) : (
									<div className="brand-link">
										<img src={brand.logo} alt={brand.name} />
										<span>{brand.name}</span>
									</div>
								)}
							</Box>
						))}
						{/* Duplicate for seamless loop */}
						{brandItems.map((brand, index) => (
							<Box key={`${brand.id}-dup-${index}`} className="brand-item">
								{brand.link ? (
									<a href={brand.link} target="_blank" rel="noopener noreferrer" className="brand-link">
										<img src={brand.logo} alt={brand.name} />
										<span>{brand.name}</span>
									</a>
								) : (
									<div className="brand-link">
										<img src={brand.logo} alt={brand.name} />
										<span>{brand.name}</span>
									</div>
								)}
							</Box>
						))}
					</Box>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="brand-carousel-container">
				<Box 
					className="brand-carousel-wrapper"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<Box className={`brand-carousel-track ${isHovered ? 'paused' : ''}`}>
						{brandItems.map((brand, index) => (
							<Box key={`${brand.id}-${index}`} className="brand-item">
								{brand.link ? (
									<a href={brand.link} target="_blank" rel="noopener noreferrer" className="brand-link">
										<img src={brand.logo} alt={brand.name} />
										<span>{brand.name}</span>
									</a>
								) : (
									<div className="brand-link">
										<img src={brand.logo} alt={brand.name} />
										<span>{brand.name}</span>
									</div>
								)}
							</Box>
						))}
						{/* Duplicate for seamless loop */}
						{brandItems.map((brand, index) => (
							<Box key={`${brand.id}-dup-${index}`} className="brand-item">
								{brand.link ? (
									<a href={brand.link} target="_blank" rel="noopener noreferrer" className="brand-link">
										<img src={brand.logo} alt={brand.name} />
										<span>{brand.name}</span>
									</a>
								) : (
									<div className="brand-link">
										<img src={brand.logo} alt={brand.name} />
										<span>{brand.name}</span>
									</div>
								)}
							</Box>
						))}
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default BrandCarousel;

