import React from 'react';
import { Stack } from '@mui/material';
import useScrollAnimation from '../../hooks/useScrollAnimation';

interface AnimatedSectionProps {
	children: React.ReactNode;
	className?: string;
	animationDelay?: number;
	animationType?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
	children,
	className = '',
	animationDelay = 0,
	animationType = 'fade-up',
}) => {
	const { elementRef, isVisible } = useScrollAnimation({
		threshold: 0.1,
		rootMargin: '0px 0px -100px 0px',
		triggerOnce: false, // Allow animations when scrolling up
	});

	const getAnimationStyles = () => {
		// Remove delay from transition to allow immediate re-animation
		const baseTransition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
		
		// Ensure smooth transitions in both scroll directions - reset to initial state when hidden
		if (animationType === 'fade-up') {
			return {
				transition: isVisible 
					? `${baseTransition} ${animationDelay}s` 
					: `${baseTransition} 0s`, // Instant reset when hiding
				transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
				opacity: isVisible ? 1 : 0,
				willChange: 'transform, opacity',
			};
		}
		
		if (animationType === 'fade-in') {
			return {
				transition: isVisible 
					? `opacity 1s ease-out ${animationDelay}s` 
					: 'opacity 0s', // Instant reset when hiding
				opacity: isVisible ? 1 : 0,
				willChange: 'opacity',
			};
		}
		
		if (animationType === 'slide-left') {
			return {
				transition: isVisible 
					? `${baseTransition} ${animationDelay}s` 
					: `${baseTransition} 0s`, // Instant reset when hiding
				transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
				opacity: isVisible ? 1 : 0,
				willChange: 'transform, opacity',
			};
		}
		
		if (animationType === 'slide-right') {
			return {
				transition: isVisible 
					? `${baseTransition} ${animationDelay}s` 
					: `${baseTransition} 0s`, // Instant reset when hiding
				transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
				opacity: isVisible ? 1 : 0,
				willChange: 'transform, opacity',
			};
		}
		
		return {};
	};

	return (
		<Stack
			ref={elementRef}
			className={`${className} ${isVisible ? `animate-${animationType}` : 'animate-hidden'}`}
			sx={getAnimationStyles()}
		>
			{children}
		</Stack>
	);
};

export default AnimatedSection;

