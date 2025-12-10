import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularProperties from '../libs/components/homepage/PopularProperties';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import TrendProperties from '../libs/components/homepage/TrendProperties';
import TopProperties from '../libs/components/homepage/TopProperties';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AnimatedSection from '../libs/components/common/AnimatedSection';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<AnimatedSection animationType="fade-up" animationDelay={0}>
				<TrendProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.1}>
				<PopularProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-in" animationDelay={0.2}>
				<Advertisement />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.3}>
				<TopProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.4}>
				<TopAgents />
				</AnimatedSection>
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<AnimatedSection animationType="fade-up" animationDelay={0}>
				<TrendProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.1}>
				<PopularProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-in" animationDelay={0.2}>
				<Advertisement />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.3}>
				<TopProperties />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.4}>
				<TopAgents />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.5}>
				<Events />
				</AnimatedSection>
				<AnimatedSection animationType="fade-up" animationDelay={0.6}>
				<CommunityBoards />
				</AnimatedSection>
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
