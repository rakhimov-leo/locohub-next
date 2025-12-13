import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { useCursorGlow } from '../libs/hooks/useCursorGlow';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const AppContent = ({ Component, pageProps }: AppProps) => {
	useCursorGlow();
	
	// Disable browser's automatic scroll restoration
	useEffect(() => {
		if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
			window.history.scrollRestoration = 'manual';
		}
	}, []);
	
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
