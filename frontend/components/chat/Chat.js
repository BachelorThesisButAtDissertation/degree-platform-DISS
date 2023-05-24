import clsx from 'clsx';
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form, IconButton } from 'rsuite';
import styles from '../../styles/ChatList.module.css';
import CloseIcon from '@rsuite/icons/Close';
import {
    getChatByChatId,
    listenChat,
    sendMessageInChat,
} from '../../lib/chat/chatFunc';

const Chat = ({ userId, id, to, closeChat }) => {
    const [open, setOpen] = useState(true);
    const [messages, setMessages] = useState({});
    const [message, setMessage] = useState({
        message: '',
    });
    const viewRef = useRef();
    const sound = useMemo(() => new Audio('/notification.mp3'), []);

    const loadMessages = async () => {
        const oldMsg = await getChatByChatId(id);
        setMessages(
            oldMsg.reduce(
                (a, c) => ({
                    ...a,
                    [c.id]: c,
                }),
                {}
            )
        );
    };

    useEffect(() => {
        loadMessages();
        const unsub = listenChat(id, () => {
            loadMessages();
        });
        return () => {
            unsub();
        };
    }, []);

    const submitMessage = () => {
        if (message.message !== '') {
            setMessage({
                message: '',
            });
            sendMessageInChat(id, userId, message.message);
        }
    };

    useEffect(() => {
        viewRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            {open ? (
                <div className={styles.chatWindow}>
                    <div className={styles.title}>
                        <p>{to?.displayName}</p>
                        <IconButton
                            appearance='primary'
                            onClick={() => closeChat()}
                            icon={<CloseIcon />}
                        />
                    </div>

                    <div className={styles.chatWindowBody}>
                        {Object.values(messages).map((msg) => (
                            <p
                                key={msg.id}
                                className={clsx(
                                    styles.message,
                                    msg.sender === userId
                                        ? styles.sent
                                        : styles.received
                                )}
                            >
                                {msg.message}
                                <span>{new Date(msg.time).toDateString()}</span>
                            </p>
                        ))}
                        <div ref={viewRef}></div>
                    </div>
                    <Form
                        className={styles.form}
                        layout='inline'
                        formValue={message}
                        onChange={setMessage}
                        onSubmit={submitMessage}
                    >
                        <Form.Group controlId='message'>
                            <Form.Control
                                name='message'
                                placeholder='Type something...'
                                style={{ width: 210 }}
                            />
                        </Form.Group>

                        <Button type='submit' appearance='primary'>
                            Send
                        </Button>
                    </Form>
                </div>
            ) : (
                <Button
                    size='lg'
                    appearance='primary'
                    onClick={() => setOpen(!open)}
                >
                    Xulescu Ygrelescu
                </Button>
            )}
        </>
    );
};

export default Chat;
