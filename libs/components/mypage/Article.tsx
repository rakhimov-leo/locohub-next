import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import Image from 'next/image';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Article = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>PROPERTY CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Image
						src="/img/apartmentMain.png"
						alt="Property image"
						width={400}
						height={300}
						loading="lazy"
						style={{ width: '100%', height: 'auto' }}
					/>
					<Box component={'div'} className={'date'}>
						<Typography>July 28</Typography>
					</Box>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Typography>Paradise City Theme Park</Typography>
						</Stack>
						<Stack className="address">
							<Typography>France </Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Article;
