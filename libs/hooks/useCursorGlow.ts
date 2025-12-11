import { useEffect, useState } from 'react';

export const useCursorGlow = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		// Check initial dark mode state
		const checkDarkMode = () => {
			return document.documentElement.classList.contains('dark-mode');
		};

		setIsDarkMode(checkDarkMode());

		// Watch for dark mode changes
		const observer = new MutationObserver(() => {
			const currentDarkMode = checkDarkMode();
			setIsDarkMode(currentDarkMode);
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		// Only run in dark mode
		if (!isDarkMode) {
			// Remove any existing cursor elements if dark mode is off
			const existingGlow = document.querySelector('.cursor-glow');
			const existingDot = document.querySelector('.cursor-dot-custom');
			if (existingGlow) existingGlow.remove();
			if (existingDot) existingDot.remove();
			return;
		}

		let cursorGlow: HTMLElement | null = null;
		let cursorDot: HTMLElement | null = null;

		// Create cursor glow element
		const createCursorGlow = () => {
			// Remove existing elements if any
			const existingGlow = document.querySelector('.cursor-glow');
			const existingDot = document.querySelector('.cursor-dot-custom');
			if (existingGlow) existingGlow.remove();
			if (existingDot) existingDot.remove();

			cursorGlow = document.createElement('div');
			cursorGlow.className = 'cursor-glow';
			document.body.appendChild(cursorGlow);

			// Create cursor dot
			cursorDot = document.createElement('div');
			cursorDot.className = 'cursor-dot-custom';
			cursorDot.style.cssText = `
				position: fixed;
				width: 8px;
				height: 8px;
				border-radius: 50%;
				background: #34d399;
				pointer-events: none;
				z-index: 10000;
				transform: translate(-50%, -50%);
				box-shadow: 0 0 10px rgba(52, 211, 153, 0.8),
				            0 0 20px rgba(52, 211, 153, 0.6),
				            0 0 30px rgba(52, 211, 153, 0.4);
				opacity: 0;
				transition: opacity 0.2s ease;
			`;
			document.body.appendChild(cursorDot);
		};

		// Update cursor position
		const updateCursor = (e: MouseEvent) => {
			if (cursorGlow && cursorDot && isDarkMode) {
				cursorGlow.style.left = e.clientX + 'px';
				cursorGlow.style.top = e.clientY + 'px';
				cursorGlow.style.opacity = '1';

				cursorDot.style.left = e.clientX + 'px';
				cursorDot.style.top = e.clientY + 'px';
				cursorDot.style.opacity = '1';
			}
		};

		// Hide cursor when leaving window
		const hideCursor = () => {
			if (cursorGlow && cursorDot) {
				cursorGlow.style.opacity = '0';
				cursorDot.style.opacity = '0';
			}
		};

		// Increase glow on hover over interactive elements
		const handleMouseEnter = (e: MouseEvent) => {
			if (!isDarkMode) return;
			const target = e.target as HTMLElement;
			if (
				target.tagName === 'A' ||
				target.tagName === 'BUTTON' ||
				target.onclick !== null ||
				target.style.cursor === 'pointer' ||
				target.closest('a') ||
				target.closest('button')
			) {
				if (cursorGlow) {
					cursorGlow.style.width = '300px';
					cursorGlow.style.height = '300px';
					cursorGlow.style.background = 'radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, transparent 70%)';
				}
				if (cursorDot) {
					cursorDot.style.width = '12px';
					cursorDot.style.height = '12px';
				}
			}
		};

		const handleMouseLeave = (e: MouseEvent) => {
			if (!isDarkMode) return;
			if (cursorGlow) {
				cursorGlow.style.width = '200px';
				cursorGlow.style.height = '200px';
				cursorGlow.style.background = 'radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)';
			}
			if (cursorDot) {
				cursorDot.style.width = '8px';
				cursorDot.style.height = '8px';
			}
		};

		createCursorGlow();

		const mousemoveHandler = updateCursor;
		const mouseleaveHandler = hideCursor;
		const mouseenterHandler = () => {
			if (cursorDot && isDarkMode) cursorDot.style.opacity = '1';
		};

		document.addEventListener('mousemove', mousemoveHandler);
		document.addEventListener('mouseleave', mouseleaveHandler);
		document.addEventListener('mouseenter', mouseenterHandler);

		// Add hover effects for interactive elements
		const interactiveElements = document.querySelectorAll('a, button, [role="button"], .cursor-pointer');
		interactiveElements.forEach((el) => {
			el.addEventListener('mouseenter', handleMouseEnter as any);
			el.addEventListener('mouseleave', handleMouseLeave as any);
		});

		return () => {
			document.removeEventListener('mousemove', mousemoveHandler);
			document.removeEventListener('mouseleave', mouseleaveHandler);
			document.removeEventListener('mouseenter', mouseenterHandler);
			if (cursorGlow) cursorGlow.remove();
			if (cursorDot) cursorDot.remove();
		};
	}, [isDarkMode]);
};

