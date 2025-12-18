import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/router';
import { Direction } from '../enums/common.enum';

const Footer = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	/** HANDLERS **/
	const navigateToProperty = () => {
		router.push('/property').then();
	};

	const navigateToAbout = () => {
		router.push('/about').then();
	};

	const navigateToCS = () => {
		router.push('/cs').then();
	};

	const navigateToLocation = (location: string) => {
		const input = {
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {
				locationList: [location],
				pricesRange: {
					start: 0,
					end: 2000000,
				},
			},
		};

		const inputStr = JSON.stringify(input);
		router
			.push(`/property?input=${inputStr}`, `/property?input=${inputStr}`, {
				scroll: false,
			})
			.then();
	};

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							{/* <img src="/img/logo/logoWhite.jpg" alt="" className={'logo'} /> */}
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>total free customer care</span>
							<p onClick={() => (window.location.href = 'tel:+821084779503')}>+82 10 8477 9503</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>need live</span>
							<p onClick={() => (window.location.href = 'tel:+821084779503')}>+82 10 8477 9503</p>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Search</strong>
								<span onClick={navigateToProperty}>Property for Rent</span>
								<span onClick={navigateToProperty}>Property Low to hide</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span onClick={navigateToAbout}>Terms of Use</span>
								<span onClick={navigateToAbout}>Privacy Policy</span>
								<span onClick={navigateToAbout}>Pricing Plans</span>
								<span onClick={navigateToAbout}>Our Services</span>
								<span onClick={navigateToCS}>Contact Support</span>
								<span onClick={navigateToCS}>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span onClick={() => navigateToLocation('FRANCE')}>France</span>
								<span onClick={() => navigateToLocation('SPAIN')}>Spain</span>
								<span onClick={() => navigateToLocation('ITALY')}>Italy</span>
								<span onClick={() => navigateToLocation('GERMANY')}>Germany</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© LocoHub - All rights reserved. LocoHub {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					{/* Newsletter banner */}
					<Box component={'div'} className={'newsletter-banner'}>
						<div>
							<input type="text" placeholder={'Your Email'} />
							<span>Subscribe</span>
						</div>
					</Box>

					{/* Content row */}
					<Stack className={'content-row'}>
						<Stack className={'left'}>
							<Box component={'div'} className={'footer-box'}>
								{/* <img src="/img/logo/logoWhite.jpg" alt="" className={'logo'} /> */}
							</Box>
							<Box component={'div'} className={'footer-box'}>
								<span>total free customer care</span>
								<p onClick={() => (window.location.href = 'tel:+821084779503')}>+82 10 8477 9503</p>
							</Box>
							<Box component={'div'} className={'footer-box'}>
								<span>need live</span>
								<p onClick={() => (window.location.href = 'tel:+821084779503')}>+82 10 8477 9503</p>
								<span>Support?</span>
							</Box>
							<Box component={'div'} className={'footer-box'}>
								<p>follow us on social media</p>
								<div className={'media-box'}>
									<a href="https://facebook.com" target="_blank" rel="noreferrer">
										<FacebookOutlinedIcon />
									</a>
									<a href="https://t.me" target="_blank" rel="noreferrer">
										<TelegramIcon />
									</a>
									<a href="https://instagram.com" target="_blank" rel="noreferrer">
										<InstagramIcon />
									</a>
									<a href="https://twitter.com" target="_blank" rel="noreferrer">
										<TwitterIcon />
									</a>
								</div>
							</Box>
						</Stack>
						<Stack className={'right'}>
							<Box component={'div'} className={'bottom'}>
								<div>
									<strong>Popular Search</strong>
									<span onClick={navigateToProperty}>Hotels for Rent</span>
									<span onClick={navigateToProperty}>Best Hotel Deals</span>
									<span onClick={navigateToProperty}>Hotels for Rent</span>
									<span onClick={navigateToProperty}>Best Hotel Deals</span>
								</div>
								<div>
									<strong>Quick Links</strong>
									<span onClick={navigateToAbout}>Terms of Use</span>
									<span onClick={navigateToAbout}>Privacy Policy</span>
									<span onClick={navigateToAbout}>Pricing Plans</span>
									<span onClick={navigateToAbout}>Our Services</span>
									<span onClick={navigateToCS}>Contact Support</span>
									<span onClick={navigateToCS}>FAQs</span>
								</div>
								<div>
									<strong>Discover</strong>
									<span onClick={() => navigateToLocation('FRANCE')}>France</span>
									<span onClick={() => navigateToLocation('SPAIN')}>Spain</span>
									<span onClick={() => navigateToLocation('ITALY')}>Italy</span>
									<span onClick={() => navigateToLocation('GERMANY')}>Germany</span>
								</div>
							</Box>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© LocoHub - All rights reserved. LocoHub {moment().year()}</span>
					<Stack direction="row" spacing={1} sx={{ display: 'flex', gap: '12px' }}>
						<span style={{ cursor: 'pointer' }}>Privacy</span>
						<span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>·</span>
						<span style={{ cursor: 'pointer' }}>Terms</span>
						<span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>·</span>
						<span style={{ cursor: 'pointer' }}>Sitemap</span>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
