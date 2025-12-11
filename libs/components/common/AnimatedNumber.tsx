import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';

interface AnimatedNumberProps {
	value: number;
	duration?: number;
	delay?: number;
	className?: string;
}

export interface AnimatedNumberRef {
	startAnimation: () => void;
	reset: () => void;
}

const AnimatedNumber = forwardRef<AnimatedNumberRef, AnimatedNumberProps>(
	({ value, duration = 2500, delay = 0, className = '' }, ref) => {
		const [displayValue, setDisplayValue] = useState(value);
		const [isAnimating, setIsAnimating] = useState(false);
		const elementRef = useRef<HTMLSpanElement>(null);
		const animationFrameRef = useRef<number | null>(null);
		const timeoutRef = useRef<NodeJS.Timeout | null>(null);

		const startAnimation = () => {
			if (isAnimating) return;
			
			// Cancel any existing animation
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			
			setIsAnimating(true);
			setDisplayValue(0);
			
			const startTime = Date.now() + delay;
			const endValue = value;

			const animate = () => {
				const now = Date.now();
				const elapsed = Math.max(0, now - startTime);
				const progress = Math.min(1, elapsed / duration);

				// Easing function for smooth animation
				const easeOutQuart = 1 - Math.pow(1 - progress, 4);
				const currentValue = Math.floor(easeOutQuart * endValue);

				setDisplayValue(currentValue);

				if (progress < 1) {
					animationFrameRef.current = requestAnimationFrame(animate);
				} else {
					setDisplayValue(endValue);
					setIsAnimating(false);
				}
			};

			timeoutRef.current = setTimeout(() => {
				animationFrameRef.current = requestAnimationFrame(animate);
			}, delay);
		};

		const reset = () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			setIsAnimating(false);
			setDisplayValue(value);
		};

		useImperativeHandle(ref, () => ({
			startAnimation,
			reset,
		}));

		useEffect(() => {
			return () => {
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
				}
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
			};
		}, []);

		return (
			<span ref={elementRef} className={className}>
				{displayValue}
			</span>
		);
	}
);

AnimatedNumber.displayName = 'AnimatedNumber';

export default AnimatedNumber;

