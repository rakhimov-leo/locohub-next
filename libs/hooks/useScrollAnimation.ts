import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
	threshold?: number;
	rootMargin?: string;
	triggerOnce?: boolean;
}

const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
	const {
		threshold = 0.1,
		rootMargin = '0px',
		triggerOnce = false, // Changed to false to support bidirectional scrolling
	} = options;

	const elementRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const scrollDirection = useRef<'up' | 'down'>('down');
	const prevScrollY = useRef<number>(0);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		// Track scroll direction
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			scrollDirection.current = currentScrollY > prevScrollY.current ? 'down' : 'up';
			prevScrollY.current = currentScrollY;
		};

		// Initialize scroll position
		if (typeof window !== 'undefined') {
			prevScrollY.current = window.scrollY;
			window.addEventListener('scroll', handleScroll, { passive: true });
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// Element is in viewport - show it
					setIsVisible(true);
					if (triggerOnce) {
						observer.unobserve(element);
					}
				} else if (!triggerOnce) {
					// Out of viewport - always reset so it can re-animate on re-enter
					setIsVisible(false);
				}
			},
			{
				threshold,
				rootMargin,
			}
		);

		observer.observe(element);

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('scroll', handleScroll);
			}
			if (element) {
				observer.unobserve(element);
			}
		};
	}, [threshold, rootMargin, triggerOnce]);

	return { elementRef, isVisible };
};

export default useScrollAnimation;

