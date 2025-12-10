import React, { useEffect, useRef, useState } from 'react';
import TopPropertyCard from './TopPropertyCard';
import { Property } from '../../types/property/property';

interface AnimatedTopPropertyCardProps {
	property: Property;
	index: number;
	likePropertyHandler: any;
}

const AnimatedTopPropertyCard: React.FC<AnimatedTopPropertyCardProps> = ({
	property,
	index,
	likePropertyHandler,
}) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const scrollDirection = useRef<'up' | 'down'>('down');
	const prevScrollY = useRef<number>(0);

	useEffect(() => {
		const card = cardRef.current;
		if (!card) return;

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
					// Element enters viewport - animate it
					setIsVisible(true);
				} else {
					// Always reset when leaving viewport to allow replay
					setIsVisible(false);
				}
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -50px 0px',
			}
		);

		observer.observe(card);

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('scroll', handleScroll);
			}
			if (card) {
				observer.unobserve(card);
			}
		};
	}, []);

	// Calculate spreading direction - alternate left/right for layered effect
	const spreadDirection = index % 2 === 0 ? -1 : 1;
	const spreadAmount = Math.floor(index / 2) * 20; // Increase spread for each pair
	
	// Stagger delay - each card appears after the previous one (only when visible)
	const delay = isVisible ? index * 0.12 : 0;
	
	// Initial transform state - cards start spread out and scaled down
	const initialTransform = isVisible
		? 'translateY(0) translateX(0) scale(1) rotateY(0deg)'
		: `translateY(80px) translateX(${spreadDirection * (30 + spreadAmount)}px) scale(0.75) rotateY(${spreadDirection * 8}deg)`;

	return (
		<div
			ref={cardRef}
			className="animated-top-property-card"
			style={{
				opacity: isVisible ? 1 : 0,
				transform: initialTransform,
				transition: isVisible
					? `opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s, filter 0.7s ease-out ${delay}s`
					: 'opacity 0s, transform 0s, filter 0s', // Instant reset when hiding for re-animation
				transformOrigin: 'center bottom',
				filter: isVisible ? 'blur(0px)' : 'blur(8px)',
				willChange: 'transform, opacity, filter',
			}}
		>
			<TopPropertyCard property={property} likePropertyHandler={likePropertyHandler} />
		</div>
	);
};

export default AnimatedTopPropertyCard;

