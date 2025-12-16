import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('property');
	const [expanded, setExpanded] = useState<string | false>('panel1');

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	
	/** HANDLERS **/
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: any = {
		property: [
			{
				id: '00f5a45ed8897f8090116a01',
				subject: 'Are the hotels listed on LocoHub verified?',
				content: 'Most listings are uploaded by trusted partners and advisors. We review new hotels and remove anything that looks suspicious or inaccurate.',
			},
			{
				id: '00f5a45ed8897f8090116a22',
				subject: 'What types of hotels can I find on LocoHub?',
				content:
					'You can browse apartments, offices, mixed‑use hotels and new developments in major city areas that our advisors actively work with.',
			},
			{
				id: '00f5a45ed8897f8090116a21',
				subject: 'How do I search for a hotel on the site?',
				content:
					'Use the Hotels search page to filter by city, price range, hotel type and key features. You can combine filters and sort results by newest or most popular.',
			},
			{
				id: '00f5a45ed8897f8090116a23',
				subject: 'Can I save interesting hotels and come back later?',
				content:
					'Yes. When you are logged in you can add any hotel to Favorites, and manage them from the Me ▸ Favorites section.',
			},
			{
				id: '00f5a45ed8897f8090116a24',
				subject: 'How can I get more details about a specific hotel?',
				content:
					'Open the hotel detail page to see photos, key numbers and advisor info. From there you can send an inquiry or request a callback.',
			},
			{
				id: '00f5a45ed8897f8090116a25',
				subject: 'Does LocoHub handle the full transaction?',
				content:
					'LocoHub helps you discover hotels and connect with advisors. The actual contract, legal checks and payment flow are handled directly with the advisor and developer.',
			},
			{
				id: '00f5a45ed8897f8090116a29',
				subject: 'What should I do if hotel information looks incorrect?',
				content:
					'Use the inquiry form on the detail page or contact CS and we will re‑check the listing with the advisor and update or remove it if needed.',
			},
			{
				id: '00f5a45ed8897f8090116a28',
				subject: 'Can I search only in specific districts or neighborhoods?',
				content:
					'Yes. On the Hotels page you can narrow down by city and area, then refine further using filters such as price, size and usage type.',
			},
			{
				id: '00f5a45ed8897f8090116a27',
				subject: 'Can I list my own hotel on LocoHub?',
				content:
					'If you are an owner or developer, please contact our team through CS. We will review your project and connect you with an advisor for onboarding.',
			},
			{
				id: '00f5a45ed8897f8090116b99',
				subject: 'Does LocoHub provide legal or tax advice?',
				content:
					'We do not provide professional legal or tax advice. Your advisor can share general guidance and recommend licensed specialists when needed.',
			},
		],
		payment: [
			{
				id: '00f5a45ed8897f8090116a02',
				subject: 'Do I pay anything to use LocoHub as a buyer?',
				content: 'Browsing hotels, saving favorites and sending inquiries on LocoHub are free for buyers.',
			},
			{
				id: '00f5a45ed8897f8090116a91',
				subject: 'How are advisor fees and commissions handled?',
				content:
					'Advisor commissions and any extra fees are agreed directly between you, the advisor and the developer. LocoHub does not add hidden platform fees.',
			},
			{
				id: '00f5a45ed8897f8090116a92',
				subject: 'Can I pay in installments for a hotel?',
				content:
					'Installment plans depend on each project. Check the payment section on the hotel detail page or ask the advisor about available options.',
			},
			{
				id: '00f5a45ed8897f8090116a93',
				subject: 'Does LocoHub process my payments directly?',
				content:
					'No. At the moment payments are processed outside the platform through the advisor or developer according to your contract.',
			},
			{
				id: '00f5a45ed8897f8090116a94',
				subject: 'Will my personal and payment‑related data be safe?',
				content:
					'We protect your account data with modern security practices and only share information with advisors when you send an inquiry or request.',
			},
			{
				id: '00f5a45ed8897f8090116a95',
				subject: "What if I have an issue with a payment or contract?",
				content:
					'First contact your advisor or developer so they can check the transaction. If something still looks wrong, share details with CS and we will help coordinate.',
			},
			{
				id: '00f5a45ed8897f8090116a96',
				subject: 'Do you offer refunds through LocoHub?',
				content:
					'Refunds and cancellations follow the terms of your agreement with the advisor or developer. Please review that contract or ask them directly.',
			},
			{
				id: '00f5a45ed8897f8090116a97',
				subject: 'Can I see all costs before I decide?',
				content:
					'Yes. Advisors will share the full payment schedule, expected fees and any additional costs before you sign anything.',
			},
			{
				id: '00f5a45ed8897f8090116a99',
				subject: 'Which currency and payment methods are usually supported?',
				content:
					'Supported currencies and methods differ by project, but most advisors work with standard bank transfers and local payment options.',
			},
			{
				id: '00f5a45ed8897f8090116a98',
				subject: 'Can I track payment‑related updates in LocoHub?',
				content:
					'Important status changes are usually shared by your advisor. You can also use the Me page to review recent activity and messages.',
			},
		],
		buyers: [
			{
				id: '00f5a45ed8897f8090116a03',
				subject: 'I am buying for the first time. Where should I start?',
				content:
					'Create an account, explore Hotels, add favorites, then contact an advisor on a project you like. They will walk you through each step.',
			},
			{
				id: '00f5a45ed8897f8090116a85',
				subject: 'How can I check if a hotel fits my budget?',
				content:
					'Use filters by price, compare several options in Favorites and ask your advisor for a detailed payment schedule based on your situation.',
			},
			{
				id: '00f5a45ed8897f8090116a84',
				subject: 'What information should I prepare before talking to an advisor?',
				content:
					'Have an idea of your budget, preferred area, building size and timeline. Sharing this early helps the advisor recommend realistic options.',
			},
			{
				id: '00f5a45ed8897f8090116a83',
				subject: 'What should I look at when choosing a neighborhood?',
				content:
					'Check commute time, nearby services, schools, safety and future development plans. Use our map and photos as a starting point, then visit in person.',
			},
			{
				id: '00f5a45ed8897f8090116a82',
				subject: 'Can I negotiate the price or conditions?',
				content:
					'In many projects the price or terms are negotiable. Your advisor represents you in these discussions and will suggest a realistic strategy.',
			},
			{
				id: '00f5a45ed8897f8090116a81',
				subject: 'What are common red flags when reviewing a hotel?',
				content:
					'Be careful with unclear ownership, missing documents, unrealistic discounts or poor construction quality. Always ask your advisor to explain anything you do not understand.',
			},
			{
				id: '00f5a45ed8897f8090116a80',
				subject: 'Can LocoHub help me organize site visits?',
				content:
					'Yes. Send an inquiry from the hotel page and the advisor will coordinate viewing times and on‑site meetings.',
			},
			{
				id: '00f5a45ed8897f8090116a79',
				subject: 'How long does it usually take to find the right hotel?',
				content:
					'It depends on your requirements and market conditions. Some buyers decide within a few weeks, others need more time to compare options.',
			},
			{
				id: '00f5a45ed8897f8090116a78',
				subject: 'Why should I use LocoHub instead of searching manually?',
				content:
					'LocoHub brings verified projects, professional advisors and useful tools like favorites and My Page together in one place, saving you time and coordination effort.',
			},
			{
				id: '00f5a45ed8897f8090116a77',
				subject: 'What if I change my mind after showing interest in a hotel?',
				content:
					'You can always stop the process before signing any binding contract. Let your advisor know so they can close the case and suggest alternatives if you want.',
			},
		],

		agents: [
			{
				id: '00f5a45ed8897f8090116a04',
				subject: 'I want to work as an advisor on LocoHub. Where do I start?',
				content:
					'Send us a short introduction through the CS form. Our team will review your profile and contact you with the next steps if there is a fit.',
			},
			{
				id: '00f5a45ed8897f8090116a62',
				subject: 'What kind of advisors are you looking for?',
				content:
					'We collaborate with licensed real‑estate professionals and project specialists who actively work with new hotels and can provide on‑site support.',
			},
			{
				id: '00f5a45ed8897f8090116a63',
				subject: 'How does LocoHub help advisors find clients?',
				content:
					'LocoHub promotes hotels and advisors to buyers who are already searching. Inquiries from those projects are routed directly to the responsible advisor.',
			},
			{
				id: '00f5a45ed8897f8090116a64',
				subject: 'Do you provide any tools for managing leads?',
				content:
					'Advisors can see project inquiries, contact info and key notes in one place. We are gradually improving these tools based on advisor feedback.',
			},
			{
				id: '00f5a45ed8897f8090116a65',
				subject: 'How are responsibilities between LocoHub and advisors divided?',
				content:
					'LocoHub focuses on technology, traffic and matching. Advisors handle on‑site visits, explanations, contracts and long‑term client relationships.',
			},
			{
				id: '00f5a45ed8897f8090116a66',
				subject: 'Can advisors choose which projects to work with?',
				content:
					'Yes. We usually match you with hotels that fit your area and expertise, and you can discuss specific projects with our team.',
			},
			{
				id: '00f5a45ed8897f8090116a67',
				subject: 'Is there training or onboarding for new advisors?',
				content:
					'We share product walkthroughs, best practices and example flows so new advisors can start working smoothly on LocoHub.',
			},
			{
				id: '00f5a45ed8897f8090116a68',
				subject: 'How do advisors get support if something goes wrong?',
				content:
					'You can reach our CS team directly from your advisor contact channel. We help with account access, listing issues and basic product questions.',
			},
			{
				id: '00f5a45ed8897f8090116a69',
				subject: 'Can I pause or stop working as an advisor on LocoHub?',
				content:
					'Yes, just let our team know. We can hide your profile, reassign active projects and keep your data for future cooperation if needed.',
			},
			{
				id: '00f5a45ed8897f8090116a70',
				subject: 'How can I share feedback about LocoHub as an advisor?',
				content:
					'We welcome product feedback. Send it through CS or your advisor manager and we will consider it in our roadmap.',
			},
		],
		membership: [
			{
				id: '00f5a45ed8897f8090116a05',
				subject: 'Do I need a paid membership to use LocoHub?',
				content:
					'No. Creating an account, browsing hotels, saving favorites and using Me page features are currently free.',
			},
			{
				id: '00f5a45ed8897f8090116a60',
				subject: 'What are the benefits of creating a LocoHub account?',
				content:
					'With an account you can manage favorites, see recently viewed hotels, edit your profile and keep all activity in one place.',
			},
			{
				id: '00f5a45ed8897f8090116a59',
				subject: 'How do I sign up or log in?',
				content:
					'Use the Login/Signup option in the top‑right corner, fill in the short form and confirm your details. After that you can access the Me page.',
			},
			{
				id: '00f5a45ed8897f8090116a58',
				subject: 'Can I edit or delete my profile information later?',
				content:
					'Yes. Go to Me ▸ Profile to update your personal details. If you want your account removed completely, contact CS.',
			},
			{
				id: '00f5a45ed8897f8090116a57',
				subject: 'Is there a premium or paid plan?',
				content:
					'We are currently focused on improving the core free experience. If we introduce paid features in the future, we will announce them clearly in advance.',
			},
			{
				id: '00f5a45ed8897f8090116a56',
				subject: 'What should I do if I forget my password?',
				content:
					'Use the “Forgot password” flow on the login page. If you still cannot access your account, contact CS with the email you registered with.',
			},
			{
				id: '00f5a45ed8897f8090116a55',
				subject: 'Can I use my account on different devices?',
				content:
					'Yes. You can sign in to the same LocoHub account from desktop or mobile browser. Just keep your login data private.',
			},
			{
				id: '00f5a45ed8897f8090116a54',
				subject: 'Will you notify me about new hotels or updates?',
				content:
					'We may occasionally share important updates or recommended projects. You can control basic communication preferences in your profile.',
			},
			{
				id: '00f5a45ed8897f8090116a33',
				subject: 'Can multiple people share one account?',
				content:
					'For security and tracking reasons we recommend one account per person. If you are a company, talk to us about the best setup.',
			},
			{
				id: '00f5a45ed8897f8090116a32',
				subject: 'How is my account data protected?',
				content:
					'We store account data securely and only use it to provide LocoHub services in line with our privacy policy.',
			},
		],
		other: [
			{
				id: '00f5a45ed8897f8090116a40',
				subject: 'How can I contact the LocoHub team?',
				content:
					'Use the CS page, send an inquiry from any hotel, or reach out via the contact information shown in the footer of the site.',
			},
			{
				id: '00f5a45ed8897f8090116a39',
				subject: 'I found a bug or something looks wrong. What should I do?',
				content:
					'Please send us a short description and, if possible, a screenshot through CS. It helps us reproduce and fix the issue faster.',
			},
			{
				id: '00f5a45ed8897f8090116a38',
				subject: 'Can I suggest a new feature for LocoHub?',
				content:
					'Yes, we appreciate ideas. Share how the feature would help you and we will review it for our product roadmap.',
			},
			{
				id: '00f5a45ed8897f8090116a36',
				subject: 'Do you have a mobile app?',
				content:
					'Right now LocoHub is optimized for desktop and mobile browsers. If we release a native app in the future, we will announce it on the site.',
			},
			{
				id: '00f5a45ed8897f8090116a35',
				subject: 'In which languages is LocoHub available?',
				content:
					'You can switch site language from the header. Content availability may differ slightly by language, but the main features are the same.',
			},
			{
				id: '00f5a45ed8897f8090116a34',
				subject: 'Does LocoHub operate in all cities?',
				content:
					'We focus on selected key cities and neighborhoods. Coverage will gradually expand as we onboard new projects and advisors.',
			},
			{
				id: '00f5a45ed8897f8090116a33',
				subject: 'Can I follow news or updates about new projects?',
				content:
					'Keep an eye on the homepage and Hotels section for highlighted projects. We may also share important news through CS and notifications.',
			},
			{
				id: '00f5a45ed8897f8090116a32',
				subject: 'Do you work with corporate or bulk buyers?',
				content:
					'Yes, in many projects we can support corporate buyers. Contact us through CS with more details about your requirements.',
			},
			{
				id: '00f5a45ed8897f8090116a31',
				subject: 'Can I remove my data from LocoHub completely?',
				content:
					'If you want to close your account and request data removal, contact CS. Some information may need to be kept where the law requires it.',
			},
			{
				id: '00f5a45ed8897f8090116a30',
				subject: 'Where can I read more about your privacy and terms?',
				content:
					'Links to our privacy policy and terms of use are available in the footer. Please review them before using the service.',
			},
		],
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div
						className={category === 'property' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('property');
						}}
					>
						Property
					</div>
					<div
						className={category === 'payment' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('payment');
						}}
					>
						Payment
					</div>
					<div
						className={category === 'buyers' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('buyers');
						}}
					>
						For Buyers
					</div>
					<div
						className={category === 'agents' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('agents');
						}}
					>
						For Advisors
					</div>
					<div
						className={category === 'membership' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('membership');
						}}
					>
						Membership
					</div>
					<div
						className={category === 'other' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('other');
						}}
					>
						Other
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{data[category] &&
						data[category].map((ele: any) => (
							<Accordion expanded={expanded === ele?.id} onChange={handleChange(ele?.id)} key={ele?.subject}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										Q
									</Typography>
									<Typography> {ele?.subject}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											A
										</Typography>
										<Typography> {ele?.content}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}
};

export default Faq;
