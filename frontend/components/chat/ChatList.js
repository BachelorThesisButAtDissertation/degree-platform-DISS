import { useEffect, useState } from 'react';
import {
    Button,
    ButtonToolbar,
    Drawer,
    IconButton,
    Radio,
    RadioGroup,
} from 'rsuite';
import { getMyChats, TYPES } from '../../lib/user/userFunc';
import { getDocByRef } from '../../lib/utils';
import styles from '../../styles/ChatList.module.css';
import Chat from './Chat';

const ChatList = ({ userId, setActiveChat, activeChat, mode }) => {
    const [size, setSize] = useState('xs');
    const [open, setOpen] = useState(false);
    const [chats, setChats] = useState();

    const handleOpen = (key) => {
        setOpen(true);
        if (userId) {
            loadChats();
        }
        setChats(null);
    };

    const loadChats = async () => {
        const listOfChats = await getMyChats(userId, mode);
        const postList = [];
        for (const chat of listOfChats) {
            let chatters = [
                await getDocByRef(chat.chatters[0]),
                await getDocByRef(chat.chatters[1]),
            ];

            postList.push({
                id: chat.id,
                to: chatters.find((c) => c.id !== userId),
            });

            console.log(postList);
        }

        setChats(postList);
    };

    return (
        <>
            <Drawer
                size={size}
                placement={'right'}
                open={open}
                onClose={() => setOpen(false)}
            >
                <Drawer.Header>
                    <Drawer.Title>Chats</Drawer.Title>
                    {/* <Drawer.Actions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => setOpen(false)}
                            appearance='primary'
                        >
                            Confirm
                        </Button>
                    </Drawer.Actions> */}
                </Drawer.Header>
                <Drawer.Body>
                    {chats?.map((chat) => (
                        <div
                            key={chat.id}
                            className={styles.chatLine}
                            onClick={() => {
                                setActiveChat(chat);
                                setOpen(false);
                            }}
                        >
                            <div className={styles.photo}>
                                <img src={chat.to?.photoURL} />
                            </div>
                            <h3>{chat.to?.displayName}</h3>
                        </div>
                    ))}
                </Drawer.Body>
            </Drawer>
            <div className={styles.floatingButton}>
                {activeChat && (
                    <Chat
                        {...activeChat}
                        userId={userId}
                        closeChat={() => setActiveChat(null)}
                    />
                )}
                <Button
                    size='lg'
                    appearance='primary'
                    onClick={() => handleOpen('right')}
                >
                    Open Chat Window
                </Button>
            </div>
        </>
    );
};

export default ChatList;
