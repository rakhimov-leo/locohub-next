import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import Image from 'next/image';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopAgentProps {
	agent: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const handleOpenAgentDetail = () => {
		if (!agent?._id) return;
		router.push(`/agent/detail?agentId=${agent._id}`);
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card" onClick={handleOpenAgentDetail} sx={{ cursor: 'pointer' }}>
				<div style={{ position: 'relative', width: '100%', height: '100%' }}>
					<Image
						src={agentImage}
						alt={agent?.memberNick || 'Agent'}
						fill
						style={{ objectFit: 'cover' }}
						loading="lazy"
						unoptimized
					/>
				</div>

				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card" onClick={handleOpenAgentDetail} sx={{ cursor: 'pointer' }}>
				<div style={{ position: 'relative', width: '100%', height: '100%' }}>
					<Image
						src={agentImage}
						alt={agent?.memberNick || 'Agent'}
						fill
						style={{ objectFit: 'cover' }}
						loading="lazy"
						unoptimized
					/>
				</div>

				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType}</span>
			</Stack>
		);
	}
};

export default TopAgentCard;
