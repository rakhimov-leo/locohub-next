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
	const handleSeeAllAdvisors = () => {
		router.push('/agent');
	};

	const openAgentDetail = (memberId: string) => {
		if (!memberId) return;
		router.push(`/agent/detail?agentId=${memberId}`);
	};

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
							slidesPerView={2.8}
							centeredSlides={false}
							spaceBetween={12}
							modules={[Autoplay, Pagination]}
							pagination={{
								clickable: true,
								dynamicBullets: true,
							}}
							breakpoints={{
								320: {
									slidesPerView: 2.5,
									spaceBetween: 10,
								},
								375: {
									slidesPerView: 2.8,
									spaceBetween: 12,
								},
								425: {
									slidesPerView: 3,
									spaceBetween: 14,
								},
								480: {
									slidesPerView: 3.2,
									spaceBetween: 16,
								},
								640: {
									slidesPerView: 3.5,
									spaceBetween: 18,
								},
							}}
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
						<div className={'left'}>
							<span>Top Advisors</span>
							<p>Our Top Advisors always ready to serve you</p>
						</div>
						<div className={'right'}>
							<div className={'more-box'} onClick={handleSeeAllAdvisors} role="button">
								<span>See All Advisors</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</div>
					</Stack>
					<Stack className={'wrapper'}>
						<div className={'card-wrapper'}>
							{/* 4 profile images in center */}
							<div className={'central-profiles'}>
								{topAgents.slice(0, 4).map((agent: Member, index: number) => {
									return (
										<div
											key={agent?._id}
											className={'profile-item'}
											onClick={() => openAgentDetail(agent?._id as string)}
											style={{ cursor: 'pointer' }}
										>
											<img
												src={
													agent?.memberImage
														? `${REACT_APP_API_URL}/${agent?.memberImage}`
														: '/img/profile/defaultUser.svg'
												}
												alt={agent?.memberNick}
											/>
										</div>
									);
								})}
							</div>
							{/* Names below */}
							<div className={'agent-names-row'}>
								{topAgents.slice(0, 4).map((agent: Member, index: number) => {
									return (
										<div
											key={agent?._id}
											className={'agent-name-item'}
											onClick={() => openAgentDetail(agent?._id as string)}
											style={{ cursor: 'pointer' }}
										>
											<Typography className={'agent-name'}>{agent?.memberNick}</Typography>
											<Typography className={'agent-role'}>AGENT</Typography>
										</div>
									);
								})}
							</div>
						</div>
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
