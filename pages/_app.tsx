import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { useCursorGlow } from '../libs/hooks/useCursorGlow';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const AppContent = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();
	useCursorGlow();

	// Disable browser's automatic scroll restoration
	useEffect(() => {
		if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
			window.history.scrollRestoration = 'manual';
		}
	}, []);

	// Scroll to top on route change (except when returning to homepage with saved scroll position)
	useEffect(() => {
		const handleRouteChangeStart = (url: string) => {
			// Don't scroll to top if we're going to homepage and there's a saved scroll position
			const savedScrollPosition = sessionStorage.getItem('homepageScrollPosition');
			const fromDetailPage = sessionStorage.getItem('fromDetailPage') === 'true';

			if (url === '/' && savedScrollPosition && fromDetailPage) {
				// Let homepage handle scroll restoration
				return;
			}

			// Scroll to top immediately when route starts changing
			if (typeof window !== 'undefined') {
				window.scrollTo({
					top: 0,
					left: 0,
					behavior: 'auto',
				});
			}
		};

		const handleRouteChangeComplete = (url: string) => {
			// Don't scroll to top if we're going to homepage and there's a saved scroll position
			const savedScrollPosition = sessionStorage.getItem('homepageScrollPosition');
			const fromDetailPage = sessionStorage.getItem('fromDetailPage') === 'true';

			if (url === '/' && savedScrollPosition && fromDetailPage) {
				// Let homepage handle scroll restoration
				return;
			}

			// Ensure scroll to top after route change completes
			if (typeof window !== 'undefined') {
				// Use setTimeout to ensure DOM is ready
				setTimeout(() => {
					window.scrollTo({
						top: 0,
						left: 0,
						behavior: 'auto',
					});
					// Also set scroll position directly
					document.documentElement.scrollTop = 0;
					document.body.scrollTop = 0;
				}, 0);
			}
		};

		router.events.on('routeChangeStart', handleRouteChangeStart);
		router.events.on('routeChangeComplete', handleRouteChangeComplete);

		return () => {
			router.events.off('routeChangeStart', handleRouteChangeStart);
			router.events.off('routeChangeComplete', handleRouteChangeComplete);
		};
	}, [router]);

	return <Component {...pageProps} />;
};

const App = (props: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(props.pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppContent {...props} />
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
