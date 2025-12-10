import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface AnimatedIconProps {
	children: React.ReactNode;
	index: number;
	className?: string;
	delayMultiplier?: number;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
	children,
	index,
	className = '',
	delayMultiplier = 0.15,
}) => {
	const iconRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const scrollDirection = useRef<'up' | 'down'>('down');
	const prevScrollY = useRef<number>(0);

	useEffect(() => {
		const icon = iconRef.current;
		if (!icon) return;

		// Track scroll direction
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			scrollDirection.current = currentScrollY > prevScrollY.current ? 'down' : 'up';
			prevScrollY.current = currentScrollY;
		};

		if (typeof window !== 'undefined') {
			prevScrollY.current = window.scrollY;
			window.addEventListener('scroll', handleScroll, { passive: true });
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// Icon enters viewport - animate it
					setIsVisible(true);
				} else {
					// Icon leaves viewport - reset for re-animation
					const rect = icon.getBoundingClientRect();
					const viewportHeight = window.innerHeight;
					
					if (scrollDirection.current === 'down') {
						// Scrolling down - hide if icon is above viewport
						if (rect.bottom < -50) {
							setIsVisible(false);
						}
					} else {
						// Scrolling up - hide if icon is below viewport
						if (rect.top > viewportHeight + 50) {
							setIsVisible(false);
						}
					}
				}
			},
			{
				threshold: 0.2,
				rootMargin: '0px 0px -50px 0px',
			}
		);

		observer.observe(icon);

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('scroll', handleScroll);
			}
			if (icon) {
				observer.unobserve(icon);
			}
		};
	}, []);

	// Calculate stagger delay based on index
	const delay = isVisible ? index * delayMultiplier : 0;

	return (
		<Box
			ref={iconRef}
			className={className}
			sx={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible
					? 'translateY(0) scale(1)'
					: 'translateY(30px) scale(0.8)',
				transition: isVisible
					? `opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`
					: 'opacity 0s, transform 0s', // Instant reset when hiding
				willChange: 'transform, opacity',
			}}
		>
			{children}
		</Box>
	);
};

export default AnimatedIcon;



