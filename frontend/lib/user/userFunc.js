import { getAuth, updateProfile } from 'firebase/auth';
import {
    doc,
    addDoc,
    getFirestore,
    setDoc,
    saveDoc,
    collection,
    getDoc,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import { getTeacherDataByRef } from '../db/teacherDB';
import fbapp from '../firebase';
import { uploadFileForUser } from '../storage/storageFunc';
import { getInsideRefData } from '../utils';

const db = getFirestore(fbapp);

export const updateProfileData = ({ displayName, photoURL }) => {
    const auth = getAuth();
    return updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL,
    });
};

export const getAllStudents = async (withCollabs) => {
    const q = query(
        collection(db, 'students'),
        where('hasActiveCollaboration', '==', withCollabs)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const saveStudentInDB = (userId, data) => {
    // {displayName, email, photoURL, interests, aboutMe}
    const studRef = doc(db, 'students', userId);
    return setDoc(studRef, data, { merge: true });
};

export const createStudentInDB = (userId, data) => {
    return setDoc(doc(db, 'students', userId), data);
};

export const getUserData = async (userId) => {
    return await getDoc(doc(db, 'students', userId));
};

const decreaseRequests = async (userId, seasons) => {
    const user = JSON.parse(localStorage.getItem('userData'));
    console.log(user, 'res');
    if (user.requests === 0) {
        throw {
            message: 'You cannot send any requests anymore.',
        };
    }
    localStorage.setItem(
        'userData',
        JSON.stringify({
            ...user,
            requests: user.requests - 1,
        })
    );

    const addWeeks = (numWeeks) => {
        let now = new Date();
        now.setDate(now.getDate() + numWeeks * 7);
        return now;
    };

    const studRef = doc(db, `students`, userId);
    setDoc(
        studRef,
        {
            requests: user.requests - 1,
            nextPossibleRequest: addWeeks(seasons[0].timeUntilNext).getTime(),
        },
        { merge: true }
    );
};

export const requestToTeacher = async (
    userId,
    teacherId,
    message,
    domains,
    seasons
) => {
    // {displayName, email, photoURL, interests, aboutMe}
    const requestRef = doc(db, `requests`, `req-${Date.now()}`);
    const studRef = doc(db, `students`, userId);
    const teachRef = doc(db, `teachers`, teacherId);
    await setDoc(
        requestRef,
        {
            message: message,
            from: studRef,
            to: teachRef,
            domains: domains,
            time: Date.now(),
            response: 'NONE',
        },
        { merge: true }
    );

    await decreaseRequests(userId, seasons);
};

export const getMyStudentRequests = async (userId) => {
    const studRef = doc(db, `students`, userId);
    const q = query(collection(db, 'requests'), where('from', '==', studRef));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docm) => ({
        id: docm.id,
        ...docm.data(),
    }));
};

export const TYPES = {
    STUDENT: 'students',
    TEACHER: 'teachers',
    ADMIN: 'admins',
};

export const getMyChats = async (userId, type = 'students') => {
    const studRef = doc(db, type, userId);
    const q = query(
        collection(db, 'chats'),
        where('chatters', 'array-contains', studRef)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docm) => ({
        id: docm.id,
        ...docm.data(),
    }));
};

export const getMyCollabsStud = async (userId) => {
    const studRef = doc(db, 'students', userId);
    const q = query(
        collection(db, 'collaborations'),
        where('student', '==', studRef)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docm) => ({
        id: docm.id,
        ...docm.data(),
    }));
};

export const getCollabTasks = async (collId) => {
    const q = query(collection(db, `collaborations/${collId}/tasks`));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docm) => ({
        id: docm.id,
        ...docm.data(),
    }));
};

export const uploadCollabFile = async (userId, collabId, file) => {
    const x = await uploadFileForUser(userId, `collabs/${collabId}`, file);

    const colRef = doc(db, `collaborations`, collabId);
    setDoc(
        colRef,
        {
            files: file.name,
        },
        { merge: true }
    );
    return x;
};

export const getStudDataByRef = async (tref) => {
    return await getDoc(tref);
};

export const getCollaborationById = (cid) => {
    return getDoc(doc(db, 'collaborations', cid));
};

export const getCollaborationByRef = (ref) => {
    return getDoc(ref);
};
export const getStudentRef = (tid) => {
    return doc(db, 'students', tid)
}