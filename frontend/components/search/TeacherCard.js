import clsx from 'clsx';
import {useEffect, useState} from 'react';
import {
    Button,
    ButtonGroup,
    Form,
    Modal,
    Panel,
    toaster,
    Message,
} from 'rsuite';
import styles from '../../styles/Card.module.css';
import Textarea from '../basics/Textarea';
import { requestToTeacher, TYPES } from '../../lib/user/userFunc';
import { openChat } from '../../lib/chat/chatFunc';
import {getImageURL} from "../../lib/storage/storageFunc";


const TeacherCard = (props) => {
    const {
        id,
        displayName,
        available,
        domains,
        photo,
        interests,
        userId,
        setActiveChat,
        canRequest,
        searchMode,
        onSelect,
        fupd,
        seasons,
        adminView,
        mode,
    } = props;

    console.log('canRequest ------------------->> ', canRequest, available);
    const [open, setOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        message: '',
    });

    const [pictureUrl, setPictureUrl] = useState('');

    useEffect(() => {
        if(!photo) {
            return;
        }

        (async () => {
            const url = await getImageURL(id, photo);
            setPictureUrl(url);
        })();
    }, [])

    const onSubmit = async () => {
        try {
            await requestToTeacher(
                userId,
                props.id,
                requestData.message,
                domains,
                seasons
            );
            fupd();
            toaster.push(
                <Message showIcon type='success'>
                    Your request has been sent.
                </Message>
            );
            setOpen(false);
        } catch (e) {
            toaster.push(
                <Message showIcon type='error'>
                    {e.message}
                </Message>
            );
        }
    };

    const openNewChat = async () => {
        const chatToOpen = await openChat(
            userId,
            props.id,
            mode,
            TYPES.TEACHER
        );
        setActiveChat({
            ...chatToOpen,
            to: chatToOpen.chatters.find((c) => c.id !== userId),
        });
    };

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Modal.Header>
                    <Modal.Title>
                        Request for <strong>{displayName}</strong>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form formValue={requestData} onChange={setRequestData}>
                        <Form.Group controlId='message'>
                            <Form.ControlLabel>Domain</Form.ControlLabel>
                            <Form.Control
                                name='message'
                                accepter={Textarea}
                                placeholder='About you, reasons, experience...'
                            />
                            <Form.HelpText>
                                You can write something to{' '}
                                <strong>{displayName}</strong> in your request.
                                This might help you get selected.
                            </Form.HelpText>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => onSubmit()} appearance='primary'>
                        Send
                    </Button>
                    <Button onClick={() => setOpen(false)} appearance='subtle'>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <Panel
              shaded
              bordered
              className={styles.card}
              >
                <div className={styles.photo}>
                    <img src={pictureUrl || '/userAvatar.svg'} height='240' />
                </div>
                <Panel header={displayName} className={styles.body}>
                    <p className={styles.tags}>
                        {domains.map((t, i) => (
                            <span
                                key={i}
                                className={clsx(
                                    interests?.includes(t) && styles.active
                                )}
                            >
                                {t}
                            </span>
                        ))}
                    </p>

                    <ButtonGroup className={styles.controls} justified>
                        {!adminView && (
                            <Button
                                appearance='primary'
                                onClick={() => setOpen(true)}
                                disabled={!available || !canRequest}
                            >
                                {available ? 'Request' : 'Not available'}
                            </Button>
                        )}
                        {!searchMode && <Button onClick={() => openNewChat()}>Chat</Button>}
                        {searchMode && <Button onClick={onSelect}>Select</Button>}
                    </ButtonGroup>
                </Panel>
            </Panel>
        </>
    );
};

export default TeacherCard;
