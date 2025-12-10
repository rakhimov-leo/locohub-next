import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import AnimatedIcon from '../common/AnimatedIcon';

interface FeatureIcon {
	icon: string;
	text: string;
	color?: string;
}

const FeatureIcons: React.FC = () => {
	const device = useDeviceDetect();

	// Feature icons data - can be customized
	// Update icon paths to match your actual icon files
	const features: FeatureIcon[] = [
		{
			icon: '/img/icons/bed.svg', // Replace with your templates icon
			text: '120+ Templates',
			color: '#E8D5FF', // Light purple
		},
		{
			icon: '/img/icons/expand.svg', // Replace with your customization icon
			text: 'Customization',
			color: '#181A20', // Black
		},
	];

	if (device === 'mobile') {
		return (
			<Stack
				className="feature-icons"
				sx={{
					position: 'fixed',
					right: '20px',
					top: '50%',
					transform: 'translateY(-50%)',
					zIndex: 100,
					display: 'flex',
					flexDirection: 'column',
					gap: '16px',
				}}
			>
				{features.map((feature, index) => (
					<AnimatedIcon key={index} index={index} delayMultiplier={0.2}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								width: '120px',
								height: '80px',
								borderRadius: '12px',
								backgroundColor: feature.color || '#fff',
								padding: '12px',
								cursor: 'pointer',
								transition: 'transform 0.3s ease, box-shadow 0.3s ease',
								'&:hover': {
									transform: 'scale(1.05) translateY(-5px)',
									boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
								},
							}}
						>
							<Box
								component="img"
								src={feature.icon}
								alt={feature.text}
								sx={{
									width: '32px',
									height: '32px',
									marginBottom: '8px',
									filter: feature.color === '#181A20' ? 'invert(1)' : 'none',
								}}
							/>
							<Typography
								sx={{
									fontSize: '12px',
									fontWeight: 600,
									color: feature.color === '#181A20' ? '#fff' : '#181A20',
									textAlign: 'center',
								}}
							>
								{feature.text}
							</Typography>
						</Box>
					</AnimatedIcon>
				))}
			</Stack>
		);
	}

	return (
		<Stack
			className="feature-icons"
			sx={{
				position: 'fixed',
				right: '30px',
				top: '50%',
				transform: 'translateY(-50%)',
				zIndex: 100,
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
			}}
		>
			{features.map((feature, index) => (
				<AnimatedIcon key={index} index={index} delayMultiplier={0.15}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							width: '140px',
							height: '90px',
							borderRadius: '16px',
							backgroundColor: feature.color || '#fff',
							padding: '16px',
							cursor: 'pointer',
							transition: 'transform 0.3s ease, box-shadow 0.3s ease',
							boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
							'&:hover': {
								transform: 'scale(1.08) translateY(-8px)',
								boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.2)',
							},
						}}
					>
						<Box
							component="img"
							src={feature.icon}
							alt={feature.text}
							sx={{
								width: '40px',
								height: '40px',
								marginBottom: '10px',
								filter: feature.color === '#181A20' ? 'invert(1)' : 'none',
							}}
						/>
						<Typography
							sx={{
								fontSize: '14px',
								fontWeight: 600,
								color: feature.color === '#181A20' ? '#fff' : '#181A20',
								textAlign: 'center',
							}}
						>
							{feature.text}
						</Typography>
					</Box>
				</AnimatedIcon>
			))}
		</Stack>
	);
};

export default FeatureIcons;

