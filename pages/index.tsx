import React from 'react';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import TopProperties from '../libs/components/homepage/TopProperties';
import PopularProperties from '../libs/components/homepage/PopularProperties';
import TrendProperties from '../libs/components/homepage/TrendProperties';
import Events from '../libs/components/homepage/Events';
import TopAgents from '../libs/components/homepage/TopAgents';
import HomeAboutStory from '../libs/components/homepage/HomeAboutStory';

const HomePage: NextPage = () => {
	return (
		<Stack className={'homepage'}>
			<TopProperties />
			<PopularProperties />
			<TrendProperties />
			<Events />
			<TopAgents />
			<HomeAboutStory />
		</Stack>
	);
};

export default withLayoutMain(HomePage);
