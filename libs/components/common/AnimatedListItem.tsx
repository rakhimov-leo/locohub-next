import React, { useEffect, useRef, useState } from 'react';

interface AnimatedListItemProps {
	children: React.ReactNode;
	index: number;
	delayMultiplier?: number;
	offsetY?: number;
	offsetX?: number;
	scale?: number;
	rotateY?: number;
	className?: string;
}

const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
	children,
	index,
	delayMultiplier = 0.12,
	offsetY = 60,
	offsetX = 30,
	scale = 0.85,
	rotateY = 8,
	className = '',
}) => {
	const itemRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const scrollDirection = useRef<'up' | 'down'>('down');
	const prevScrollY = useRef<number>(0);

	useEffect(() => {
		const el = itemRef.current;
		if (!el) return;

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
					// Always show when entering viewport
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

		observer.observe(el);

		return () => {
			if (typeof window !== 'undefined') window.removeEventListener('scroll', handleScroll);
			observer.unobserve(el);
		};
	}, []);

	const spreadDirection = index % 2 === 0 ? -1 : 1;
	const spreadAmount = Math.floor(index / 2) * 15;
	const delay = isVisible ? index * delayMultiplier : 0;

	const hiddenTransform = `translateY(${offsetY}px) translateX(${spreadDirection * (offsetX + spreadAmount)}px) scale(${scale}) rotateY(${spreadDirection * rotateY}deg)`;

	return (
		<div
			ref={itemRef}
			className={className}
			style={{
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? 'translateY(0) translateX(0) scale(1) rotateY(0deg)' : hiddenTransform,
				transition: isVisible
					? `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s, filter 0.6s ease-out ${delay}s`
					: 'opacity 0s, transform 0s, filter 0s', // Instant reset when hiding for re-animation
				filter: isVisible ? 'blur(0px)' : 'blur(6px)',
				willChange: 'transform, opacity, filter',
				transformOrigin: 'center center',
			}}
		>
			{children}
		</div>
	);
};

export default AnimatedListItem;

