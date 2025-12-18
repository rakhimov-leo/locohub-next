import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Badge from '@mui/material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { Member } from '../types/member/member';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';

const NewMessage = (type: any) => {
	if (type === 'right') {
		return (
			<Box
				component={'div'}
				flexDirection={'row'}
				style={{ display: 'flex' }}
				alignItems={'flex-end'}
				justifyContent={'flex-end'}
				sx={{ m: '10px 0px' }}
			>
				<div className={'msg_right'}></div>
			</Box>
		);
	} else {
		return (
			<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
				<Avatar alt={'jonik'} src={'/img/profile/defaultUser.svg'} />
				<div className={'msg_left'}></div>
			</Box>
		);
	}
};

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}
interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	/** LIFECYCLES **/
	useEffect(() => {
		socket.onmessage = (msg) => {
			const data = JSON.parse(msg.data);
			console.log('WebSocket message:', data);

			switch (data.event) {
				case 'info':
					const newInfo: InfoPayload = data;
					setOnlineUsers(newInfo.totalClients);
					break;
				case 'getMessages':
					const list: MessagePayload[] = data.list;
					setMessagesList(list);
					break;
				case 'message':
					const NewMessage: MessagePayload = data;
					// Only add message if it's from another user (not from current user)
					if (NewMessage.memberData?._id !== user?._id) {
						setMessagesList((prev) => [...prev, NewMessage]);
					}
					break;
			}
		};
	}, [socket, messagesList]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
	};

	const getInputMessageHandler = useCallback(
		(e: any) => {
			const text = e.target.value;
			setMessageInput(text);
		},
		[messageInput],
	);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key == 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = async () => {
		if (!messageInput) sweetErrorAlert(Messages.error4);
		else {
			const userMessage = messageInput;
			setMessageInput('');

			// Add user message to chat
			const userMessagePayload: MessagePayload = {
				event: 'message',
				text: userMessage,
				memberData: user as Member,
			};
			setMessagesList((prev) => [...prev, userMessagePayload]);

			// Send to WebSocket (for real-time chat with other users)
			socket.send(JSON.stringify({ event: 'message', data: userMessage }));

			// Get AI response
			try {
				const aiResponse = await getAIResponse(userMessage);
				const aiMessagePayload: MessagePayload = {
					event: 'message',
					text: aiResponse,
					memberData: {
						_id: 'ai-assistant',
						memberNick: 'AI Assistant',
						memberFullName: 'AI Assistant',
						memberImage: '/img/profile/ai-assistant.svg',
					} as Member,
				};
				setMessagesList((prev) => [...prev, aiMessagePayload]);
			} catch (error) {
				console.error('AI response error:', error);
			}
		}
	};

	const getAIResponse = async (message: string): Promise<string> => {
		// Simple AI response logic - can be replaced with actual AI API
		// For now, return a helpful response based on keywords
		const lowerMessage = message.toLowerCase();

		if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('salom')) {
			return "Hello! I'm your AI assistant. How can I help you find the perfect stay today?";
		}
		if (lowerMessage.includes('hotel') || lowerMessage.includes('stay') || lowerMessage.includes('property')) {
			return 'I can help you find hotels and properties! You can browse our listings, filter by location, price, and amenities. What type of stay are you looking for?';
		}
		if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('narx')) {
			return "Our prices are transparent with no hidden fees. You can filter properties by price range and compare options easily. What's your budget?";
		}
		if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('qayer')) {
			return 'We have properties in many locations worldwide! Use the location filter to search by city or region. Where would you like to stay?';
		}
		if (lowerMessage.includes('help') || lowerMessage.includes('yordam')) {
			return "I'm here to help! I can assist you with finding properties, comparing prices, understanding our features, and more. What would you like to know?";
		}

		// Default response
		return "Thank you for your message! I'm here to help you find the perfect stay. You can ask me about hotels, prices, locations, or any other questions about LocoHub.";
	};

	return (
		<Stack className="chatting">
			{openButton ? (
				<button className="chat-button" onClick={handleOpenChat}>
					{open ? (
						<CloseIcon style={{ fontSize: '20px', color: '#fff' }} />
					) : (
						<>
							<AutoAwesomeIcon style={{ fontSize: '22px', color: '#a78bfa', marginRight: '8px' }} />
							<span style={{ color: '#fff', fontFamily: 'Nunito', fontWeight: 600, fontSize: '15px' }}>AI Chat</span>
						</>
					)}
				</button>
			) : null}
			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				<Box className={'chat-top'} component={'div'}>
					<Stack direction="row" alignItems="center" spacing={1}>
						<AutoAwesomeIcon style={{ fontSize: '28px', color: '#6366f1' }} />
						<div style={{ fontFamily: 'Nunito', fontWeight: 600 }}>AI Chat</div>
					</Stack>
					<RippleBadge style={{ margin: '-18px 0 0 21px' }} badgeContent={onlineUsers} />
				</Box>
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
								<div className={'welcome'}>
									Welcome to AI Chat! I'm here to help you find the perfect stay. Ask me anything!
								</div>
							</Box>
							{messagesList.map((ele: MessagePayload) => {
								const { text, memberData } = ele;
								const memberImage = memberData?.memberImage
									? `${REACT_APP_API_URL}/${memberData.memberImage}`
									: '/img/profile/defaultUser.svg';

								const isAI = memberData?._id === 'ai-assistant';
								const isUser = memberData?._id == user?._id;

								return isUser ? (
									<Box
										component={'div'}
										flexDirection={'row'}
										style={{ display: 'flex' }}
										alignItems={'flex-end'}
										justifyContent={'flex-end'}
										sx={{ m: '10px 0px' }}
									>
										<div className={'msg-right'}>{text}</div>
									</Box>
								) : (
									<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
										<Avatar
											alt={isAI ? 'AI Assistant' : 'User'}
											src={isAI ? '/img/profile/ai-assistant.svg' : memberImage}
											sx={isAI ? { bgcolor: '#6366f1' } : {}}
										>
											{isAI && <AutoAwesomeIcon style={{ color: '#fff', fontSize: '20px' }} />}
										</Avatar>
										<div className={'msg-left'}>{text}</div>
									</Box>
								);
							})}
						</Stack>
					</ScrollableFeed>
				</Box>
				<Box className={'chat-bott'} component={'div'}>
					<input
						type={'text'}
						name={'message'}
						className={'msg-input'}
						placeholder={'Type message'}
						value={messageInput}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button className={'send-msg-btn'} onClick={onClickHandler}>
						<SendIcon style={{ color: '#fff' }} />
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;
