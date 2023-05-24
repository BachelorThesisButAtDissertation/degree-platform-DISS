import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    onSnapshot,
    query,
    setDoc,
    where,
} from 'firebase/firestore';
import fbapp from '../firebase';
import { getDocByRef } from '../utils';

const db = getFirestore(fbapp);

export const getChatByChatId = async (chatId) => {
    const q = query(collection(db, `chats/${chatId}/messages`));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docm) => ({
        id: docm.id,
        ...docm.data(),
    }));
};

export const listenChat = (chatId, callback) => {
    return onSnapshot(doc(db, `chats/${chatId}`), callback);
};

export const sendMessageInChat = (chatId, userId, message) => {
    const msgRef = doc(db, `chats/${chatId}/messages`, `msg-${Date.now()}`);
    setDoc(
        msgRef,
        {
            message: message,
            time: Date.now(),
            sender: userId,
        },
        { merge: true }
    );

    const chatRef = doc(db, `chats`, chatId);
    setDoc(
        chatRef,
        {
            lastMessage: Date.now(),
        },
        { merge: true }
    );
};

export const chatExists = async (userId, to) => {
    const studRef = doc(db, `students`, userId);
    const teachRef = doc(db, `teachers`, to);
    const q = query(
        collection(db, 'chats'),
        where('chatters', '==', [studRef, teachRef])
    );

    const chats = await getDocs(q);

    return chats.docs;
};

export const createChat = async (userId, to, mode, toMode) => {
    const studRef = doc(db, mode, userId);
    const teachRef = doc(db, toMode, to);

    const chatRef = doc(db, `chats`, `chat-${Date.now()}`);
    await setDoc(
        chatRef,
        {
            chatters: [studRef, teachRef],
            lastMessage: Date.now(),
        },
        { merge: true }
    );
    return await getDoc(chatRef);
};

export const openChat = async (userId, to, mode, toMode) => {
    const chats = await chatExists(userId, to);
    if (!chats.length) {
        const dat = await createChat(userId, to, mode, toMode);
        const cdt = await dat.data();
        return {
            ...cdt,
            id: dat.id,
            chatters: [
                await getDocByRef(cdt.chatters[0]),
                await getDocByRef(cdt.chatters[1]),
            ],
        };
    } else {
        const chatsNew = await chatExists(userId, to);
        const cdt = chats[0].data();
        return {
            ...cdt,
            id: chatsNew[0].id,
            chatters: [
                await getDocByRef(cdt.chatters[0]),
                await getDocByRef(cdt.chatters[1]),
            ],
        };
    }
};
