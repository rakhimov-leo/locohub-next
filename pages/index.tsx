import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import PopularProperties from '../libs/components/homepage/PopularProperties';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import TrendProperties from '../libs/components/homepage/TrendProperties';
import TopProperties from '../libs/components/homepage/TopProperties';
import { Stack } from '@mui/material';
import BrandCarousel from '../libs/components/homepage/BrandCarousel';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AnimatedSection from '../libs/components/common/AnimatedSection';
import HomeAboutStory from '../libs/components/homepage/HomeAboutStory';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	// Restore scroll position when returning from property detail page
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			(router.pathname === '/' || router.asPath === '/' || window.location.pathname === '/')
		) {
			// Check if we're returning from a detail page
			const savedScrollPosition = sessionStorage.getItem('homepageScrollPosition');
			const fromDetailPage = sessionStorage.getItem('fromDetailPage') === 'true';

			console.log('Homepage mounted. Saved position:', savedScrollPosition, 'From detail:', fromDetailPage);

			if (savedScrollPosition && fromDetailPage) {
				const scrollY = parseFloat(savedScrollPosition);

				if (!isNaN(scrollY) && scrollY > 0) {
					console.log('Will restore scroll position:', scrollY);

					let restored = false;

					// Restore scroll function - use requestAnimationFrame for immediate execution
					const restoreScroll = () => {
						if (restored) return; // Only restore once

						const currentScroll =
							window.scrollY ||
							window.pageYOffset ||
							document.documentElement.scrollTop ||
							document.body.scrollTop ||
							0;

						// Only restore if we're not already at the correct position
						if (Math.abs(currentScroll - scrollY) > 10) {
							console.log('Restoring scroll position:', scrollY, 'Current scroll:', currentScroll);
							restored = true;

							// Use multiple methods to ensure scroll works - immediate execution
							window.scrollTo({
								top: scrollY,
								left: 0,
								behavior: 'auto',
							});
							document.documentElement.scrollTop = scrollY;
							document.body.scrollTop = scrollY;

							// Clear the flag after restoring
							sessionStorage.removeItem('fromDetailPage');
						}
					};

					// Immediately set scroll position to prevent flash
					// Use requestAnimationFrame for immediate execution before paint
					requestAnimationFrame(() => {
						window.scrollTo({
							top: scrollY,
							left: 0,
							behavior: 'auto',
						});
						document.documentElement.scrollTop = scrollY;
						document.body.scrollTop = scrollY;
					});

					// Also try immediately (synchronous)
					window.scrollTo(0, scrollY);
					document.documentElement.scrollTop = scrollY;
					document.body.scrollTop = scrollY;

					// Wait for DOM to be ready - but with minimal delay
					if (document.readyState === 'complete') {
						// Page already loaded - restore immediately
						requestAnimationFrame(restoreScroll);
					} else {
						// Wait for page to load - but restore as soon as possible
						const handleLoad = () => {
							requestAnimationFrame(restoreScroll);
						};
						window.addEventListener('load', handleLoad, { once: true });

						// Also try when DOM is ready - immediate (in this branch, readyState cannot be 'complete' anymore)
						if (document.readyState === 'interactive') {
							requestAnimationFrame(restoreScroll);
						} else {
							document.addEventListener(
								'DOMContentLoaded',
								() => {
									requestAnimationFrame(restoreScroll);
								},
								{ once: true },
							);
						}
					}

					// Also try after minimal delays to ensure content is loaded (but only once)
					const timeout1 = setTimeout(() => requestAnimationFrame(restoreScroll), 0);
					const timeout2 = setTimeout(() => requestAnimationFrame(restoreScroll), 10);
					const timeout3 = setTimeout(() => requestAnimationFrame(restoreScroll), 50);

					return () => {
						clearTimeout(timeout1);
						clearTimeout(timeout2);
						clearTimeout(timeout3);
					};
				}
			}
		}
	}, [router.pathname, router.asPath]);

	// Also restore on route change complete (for browser back button)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			let restored = false;

			const handleRouteChangeComplete = (url: string) => {
				// Only restore if we're on homepage and haven't restored yet
				if ((url === '/' || url.startsWith('/?')) && !restored) {
					const savedScrollPosition = sessionStorage.getItem('homepageScrollPosition');
					const fromDetailPage = sessionStorage.getItem('fromDetailPage') === 'true';

					console.log('Route change complete. Saved position:', savedScrollPosition, 'From detail:', fromDetailPage);

					if (savedScrollPosition && fromDetailPage) {
						const scrollY = parseFloat(savedScrollPosition);
						if (!isNaN(scrollY) && scrollY > 0) {
							restored = true;

							setTimeout(() => {
								window.scrollTo({
									top: scrollY,
									left: 0,
									behavior: 'auto',
								});
								document.documentElement.scrollTop = scrollY;
								document.body.scrollTop = scrollY;

								// Clear the flag after restoring
								sessionStorage.removeItem('fromDetailPage');
							}, 100);
						}
					}
				}
			};

			router.events.on('routeChangeComplete', handleRouteChangeComplete);

			return () => {
				router.events.off('routeChangeComplete', handleRouteChangeComplete);
			};
		}
	}, [router]);

	// Save scroll position before navigating away
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const handleRouteChangeStart = (url: string) => {
				// Save if navigating to property detail page or event detail page from homepage
				if (url.includes('/property/detail') || url.includes('/event/detail')) {
					const currentPath = window.location.pathname;
					if (currentPath === '/' || currentPath.startsWith('/?')) {
						const scrollY =
							window.scrollY ||
							window.pageYOffset ||
							document.documentElement.scrollTop ||
							document.body.scrollTop ||
							0;
						sessionStorage.setItem('homepageScrollPosition', scrollY.toString());
						sessionStorage.setItem('fromDetailPage', 'true');
						console.log('Route change: Saved scroll position:', scrollY);
					}
				}
			};

			router.events.on('routeChangeStart', handleRouteChangeStart);

			return () => {
				router.events.off('routeChangeStart', handleRouteChangeStart);
			};
		}
	}, [router]);

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<AnimatedSection animationType="fade-up" animationDelay={0}>
					<TrendProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.1}>
					<PopularProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.2}>
					<TopProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.3}>
					<TopAgents />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.35}>
					<HomeAboutStory />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.45}>
					<Events />
				</AnimatedSection>
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<BrandCarousel />
				<AnimatedSection animationType="fade-up" animationDelay={0}>
					<TrendProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.1}>
					<PopularProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.2}>
					<TopProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.3}>
					<TopAgents />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.35}>
					<HomeAboutStory />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.45}>
					<Events />
				</AnimatedSection>
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
