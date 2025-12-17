import React, { useRef, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { PropertyLocation } from '../../enums/property.enum';

interface GlobeLocationProps {
	locations: PropertyLocation[];
	selectedLocations: PropertyLocation[];
	onLocationClick: (location: PropertyLocation) => void;
}

// Location coordinates on globe (latitude, longitude)
// Adjusted to spread out locations more evenly - keeping good separation
const locationCoords: Record<PropertyLocation, { lat: number; lng: number }> = {
	[PropertyLocation.SEOUL]: { lat: 37.5665, lng: 126.978 },
	[PropertyLocation.FRANCE]: { lat: 33.9, lng: -28.8 },
	[PropertyLocation.SPAIN]: { lat: -15.0, lng: 130.0 },
	[PropertyLocation.ITALY]: { lat: 20.0, lng: 10.0 },
	[PropertyLocation.GERMANY]: { lat: 54.5, lng: 8.0 },
	[PropertyLocation.USA]: { lat: 40.7, lng: -74.0 },
	[PropertyLocation.UK]: { lat: -54.5, lng: -172.0 },
};

// Different random intervals for each location (in milliseconds)
const locationIntervals: Record<PropertyLocation, number> = {
	[PropertyLocation.SEOUL]: 15000,
	[PropertyLocation.FRANCE]: 14000,
	[PropertyLocation.SPAIN]: 20000,
	[PropertyLocation.ITALY]: 15000,
	[PropertyLocation.GERMANY]: 14000,
	[PropertyLocation.USA]: 20000,
	[PropertyLocation.UK]: 15000,
};

const GlobeLocation: React.FC<GlobeLocationProps> = ({ locations, selectedLocations, onLocationClick }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [lastMouseX, setLastMouseX] = useState(0);
	const [lastMouseY, setLastMouseY] = useState(0);
	const [rotationX, setRotationX] = useState(-5);
	const [rotationY, setRotationY] = useState(0);
	const [autoRotate, setAutoRotate] = useState(true);
	const [markerOffsets, setMarkerOffsets] = useState<Record<string, { lat: number; lng: number }>>({});
	const animationRef = useRef<number>();

	// Initialize offsets - set to zero for fixed positions (no random movement)
	useEffect(() => {
		const offsets: Record<string, { lat: number; lng: number }> = {};
		locations.forEach((location) => {
			// No offset - markers stay at their exact coordinates
			offsets[location] = {
				lat: 0,
				lng: 0,
			};
		});
		setMarkerOffsets(offsets);
	}, [locations]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const width = canvas.width;
		const height = canvas.height;
		const centerX = width / 2;
		const centerY = height / 2;
		const radius = Math.min(width, height) * 0.48;

		let lastTime = 0;
		const drawGlobe = (currentTime: number = 0) => {
			if (currentTime - lastTime < 16) {
				animationRef.current = requestAnimationFrame(drawGlobe);
				return;
			}
			lastTime = currentTime;

			ctx.clearRect(0, 0, width, height);

			// Draw globe base (sphere) - very light, almost white green gradient
			const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
			gradient.addColorStop(0, 'rgba(250, 253, 252, 1)');
			gradient.addColorStop(0.45, 'rgba(226, 252, 239, 0.98)');
			gradient.addColorStop(0.8, 'rgba(209, 250, 229, 0.96)');
			gradient.addColorStop(1, 'rgba(167, 243, 208, 0.95)');

			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
			ctx.fillStyle = gradient;
			ctx.fill();

			ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
			ctx.lineWidth = 1;

			for (let lat = -60; lat <= 60; lat += 30) {
				ctx.beginPath();
				for (let angle = 0; angle <= 360; angle += 5) {
					const x =
						centerX + radius * Math.cos((angle + rotationY) * (Math.PI / 180)) * Math.cos(lat * (Math.PI / 180));
					const y = centerY + radius * Math.sin(lat * (Math.PI / 180)) * Math.cos((rotationX * Math.PI) / 180);
					if (angle === 0) {
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}
				}
				ctx.stroke();
			}

			locations.forEach((location) => {
				const coords = locationCoords[location];
				if (!coords) return;

				const selected = selectedLocations.includes(location);
				const offset = markerOffsets[location] || { lat: 0, lng: 0 };

				const adjustedLat = coords.lat + offset.lat;
				const adjustedLng = coords.lng + offset.lng;

				const phi = (90 - adjustedLat) * (Math.PI / 180);
				const theta = (adjustedLng + 180) * (Math.PI / 180);

				const rotY = (rotationY * Math.PI) / 180;
				const x1 = Math.sin(phi) * Math.cos(theta + rotY);
				const y1 = Math.cos(phi);
				const z1 = Math.sin(phi) * Math.sin(theta + rotY);

				const rotX = (rotationX * Math.PI) / 180;
				const cosX = Math.cos(rotX);
				const sinX = Math.sin(rotX);
				const y = y1 * cosX - z1 * sinX;
				const z = y1 * sinX + z1 * cosX;
				const x = x1;

				const scale = radius;
				const screenX = centerX + x * scale;
				const screenY = centerY + y * scale;

				if (z > -0.5) {
					const markerSize = selected ? 8 : 7;
					ctx.beginPath();
					ctx.arc(screenX, screenY, markerSize, 0, Math.PI * 2);
					ctx.fillStyle = selected ? '#34d399' : '#ffffff';
					ctx.fill();
					ctx.strokeStyle = selected ? '#10b981' : '#667eea';
					ctx.lineWidth = 2.5;
					ctx.stroke();

					if (selected) {
						ctx.beginPath();
						ctx.arc(screenX, screenY, markerSize + 5, 0, Math.PI * 2);
						ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
						ctx.lineWidth = 2;
						ctx.stroke();
					}

					ctx.save();
					ctx.font = 'bold 11px sans-serif';
					ctx.fillStyle = selected ? '#16a34a' : '#181a20';
					ctx.textAlign = 'left';
					ctx.textBaseline = 'middle';
					ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
					ctx.shadowBlur = 4;
					ctx.shadowOffsetX = 1;
					ctx.shadowOffsetY = 1;

					const textX = screenX + markerSize + 8;
					const textY = screenY;
					ctx.fillText(location, textX, textY);
					ctx.restore();
				}
			});

			if (!isDragging && autoRotate) {
				setRotationY((prev) => prev + 0.085);
				setRotationX((prev) => {
					const newX = prev + 0.05;
					if (newX > 20) return -30;
					if (newX < -30) return 20;
					return newX;
				});
			}

			animationRef.current = requestAnimationFrame(drawGlobe);
		};

		const frameId = requestAnimationFrame(drawGlobe);

		return () => {
			if (frameId) {
				cancelAnimationFrame(frameId);
			}
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [locations, selectedLocations, rotationX, rotationY, isDragging, autoRotate, markerOffsets]);

	const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
		setIsDragging(true);
		setAutoRotate(false);
		setLastMouseX(e.clientX);
		setLastMouseY(e.clientY);
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDragging) return;

		const deltaX = e.clientX - lastMouseX;
		const deltaY = e.clientY - lastMouseY;

		setRotationY((prev) => prev + deltaX * 0.3);
		setRotationX((prev) => Math.max(-45, Math.min(45, prev + deltaY * 0.3)));
		setLastMouseX(e.clientX);
		setLastMouseY(e.clientY);
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		setTimeout(() => {
			setAutoRotate(true);
		}, 2000);
	};

	const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const radius = Math.min(canvas.width, canvas.height) * 0.48;

		locations.forEach((location) => {
			const coords = locationCoords[location];
			if (!coords) return;

			const offset = markerOffsets[location] || { lat: 0, lng: 0 };
			const adjustedLat = coords.lat + offset.lat;
			const adjustedLng = coords.lng + offset.lng;

			const phi = (90 - adjustedLat) * (Math.PI / 180);
			const theta = (adjustedLng + 180) * (Math.PI / 180);

			const rotY = (rotationY * Math.PI) / 180;
			const x1 = Math.sin(phi) * Math.cos(theta + rotY);
			const y1 = Math.cos(phi);
			const z1 = Math.sin(phi) * Math.sin(theta + rotY);

			const rotX = (rotationX * Math.PI) / 180;
			const cosX = Math.cos(rotX);
			const sinX = Math.sin(rotX);
			const y3d = y1 * cosX - z1 * sinX;
			const z3d = y1 * sinX + z1 * cosX;
			const x3d = x1;

			if (z3d > -0.5) {
				const scale3d = radius;
				const screenX = centerX + x3d * scale3d;
				const screenY = centerY + y3d * scale3d;

				const distance = Math.sqrt((x - screenX) ** 2 + (y - screenY) ** 2);
				if (distance < 15) {
					onLocationClick(location);
				}
			}
		});
	};

	return (
		<Stack
			className="globe-container"
			style={{
				width: '100%',
				height: '280px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				position: 'relative',
				marginBottom: '15px',
			}}
		>
			<canvas
				ref={canvasRef}
				width={400}
				height={280}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				onClick={handleClick}
				style={{
					cursor: isDragging ? 'grabbing' : 'grab',
					borderRadius: '12px',
				}}
			/>
		</Stack>
	);
};

export default GlobeLocation;
