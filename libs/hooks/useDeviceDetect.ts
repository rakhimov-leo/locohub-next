import { useEffect, useState } from 'react';

const useDeviceDetect = (): string => {
	const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		
		// Check device using multiple methods for better accuracy
		const checkDevice = () => {
			// Method 1: Check screen width (more reliable for responsive design)
			const isMobileByWidth = typeof window !== 'undefined' && window.innerWidth < 768;
			
			// Method 2: Check user agent
			const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
			const isMobileByUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
			
			// Use width check if available, otherwise fall back to user agent
			const isMobile = isMobileByWidth || (typeof window === 'undefined' && isMobileByUA);
			
			setDevice(isMobile ? 'mobile' : 'desktop');
		};

		checkDevice();

		// Listen for window resize to handle device orientation changes
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', checkDevice);
			return () => window.removeEventListener('resize', checkDevice);
		}
	}, []);

	// Return desktop during SSR to avoid hydration mismatch
	if (!mounted) {
		return 'desktop';
	}

	return device;
};

export default useDeviceDetect;
