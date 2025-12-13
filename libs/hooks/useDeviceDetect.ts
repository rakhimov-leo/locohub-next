import { useEffect, useState } from 'react';

const useDeviceDetect = (): string => {
	const [device, setDevice] = useState('desktop');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const userAgent = navigator.userAgent;
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		setDevice(isMobile ? 'mobile' : 'desktop');
	}, []);

	// Return desktop during SSR to avoid hydration mismatch
	if (!mounted) {
		return 'desktop';
	}

	return device;
};

export default useDeviceDetect;
