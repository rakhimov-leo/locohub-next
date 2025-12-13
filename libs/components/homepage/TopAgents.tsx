import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopAgentCard from './TopAgentCard';
import AnimatedListItem from '../common/AnimatedListItem';
import { Member } from '../../types/member/member';
import { AgentsInquiry } from '../../types/member/member.input';
import { GET_AGENTS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { REACT_APP_API_URL } from '../../config';

interface TopAgentsProps {
	initialInput: AgentsInquiry;
}

const TopAgents = (props: TopAgentsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topAgents, setTopAgents] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopAgents(data?.getAgents?.list);
		},
	});
	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Advisors</span>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-agents-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{topAgents.map((agent: Member, index: number) => {
								return (
									<SwiperSlide className={'top-agents-slide'} key={agent?._id}>
										<AnimatedListItem index={index}>
										<TopAgentCard agent={agent} key={agent?.memberNick} />
										</AnimatedListItem>
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-agents'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top Advisors</span>
							<p>Our Top Advisors always ready to serve you</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<span>See All Advisors</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'card-wrapper'}>
							{/* 4 profile images in center */}
							<Box className={'central-profiles'}>
								{topAgents.slice(0, 4).map((agent: Member, index: number) => {
									return (
										<Box key={agent?._id} className={'profile-item'}>
											<img
												src={
													agent?.memberImage
														? `${REACT_APP_API_URL}/${agent?.memberImage}`
														: '/img/profile/defaultUser.svg'
												}
												alt={agent?.memberNick}
											/>
										</Box>
									);
								})}
							</Box>
							{/* Names below */}
							<Box className={'agent-names-row'}>
								{topAgents.slice(0, 4).map((agent: Member, index: number) => {
									return (
										<Box key={agent?._id} className={'agent-name-item'}>
											<Typography className={'agent-name'}>{agent?.memberNick}</Typography>
											<Typography className={'agent-role'}>AGENT</Typography>
										</Box>
									);
								})}
							</Box>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopAgents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopAgents;
