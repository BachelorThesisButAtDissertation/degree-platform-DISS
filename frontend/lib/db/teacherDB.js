import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    setDoc,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import fbapp from '../firebase';

const db = getFirestore(fbapp);

export const getTeachRef = (tid) => {
    return doc(db, 'teachers', tid)
}

export const searchTeachers = async (interests) => {
    const q =
        interests?.length > 0
            ? query(
                  collection(db, 'teachers'),
                  where('domains', 'array-contains-any', interests)
              )
            : query(collection(db, 'teachers'));

    const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     console.log(doc.id, ' => ', doc.data());
    // });

    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const getTeacherData = async (teacherId) => {
    return await getDoc(doc(db, 'teachers', teacherId));
};

export const getTeacherDataByRef = async (tref) => {
    return await getDoc(tref);
};

export const updateProfileDataTeacher = ({ displayName, photoURL }) => {
    const auth = getAuth();
    return updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL,
    });
};

export const createTeacherInDB = (userId, data) => {
    return setDoc(doc(db, 'teachers', userId), data);
};

export const getMyTeacherRequests = async (userId, respType = 'NONE') => {
    const studRef = doc(db, `teachers`, userId);
    const q = query(
        collection(db, 'requests'),
        where('to', '==', studRef),
        where('response', '==', respType)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docm) => ({
        id: docm.id,
        ...docm.data(),
    }));
};

export const updateRequestResponse = async (requestId, response) => {
    const reqRef = doc(db, `requests`, requestId);
    setDoc(
        reqRef,
        {
            response,
        },
        { merge: true }
    );
};

export const createCollaboration = (request) => {
    console.log(request, 'create collab');
    const collabRef = doc(db, `collaborations`, `col-${request.id}`);
    setDoc(collabRef, {
        coordinator: request.to,
        student: request.from,
        title: 'Untitled yet',
        agreedOn: Date.now(),
    });
    setDoc(
        request.from,
        {
            hasActiveCollaboration: true,
            activeCollaboration: collabRef
        },
        { merge: true }
    );
};

export const getMyTeacherCollabs = async (userId) => {
    const studRef = doc(db, `teachers`, userId);
    const q = query(
        collection(db, 'collaborations'),
        where('coordinator', '==', studRef)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docm) => ({
        id: docm.id,
        ...docm.data(),
    }));
};

export const createCollaborationTask = (colId, task) => {
    const taskRef = doc(
        db,
        `collaborations/${colId}/tasks`,
        `task-${Date.now()}`
    );
    setDoc(taskRef, {
        ...task,
        status: false,
        sentOn: Date.now(),
    });
};

export const markTaskAsDone = (colId, taskId, done) => {
    const taskRef = doc(db, `collaborations/${colId}/tasks`, taskId);
    setDoc(
        taskRef,
        {
            status: done,
            completedOn: Date.now(),
        },
        { merge: true }
    );
};

export const updateCollabTitle = (colId, title) => {
    const colRef = doc(db, `collaborations`, colId);
    setDoc(
        colRef,
        {
            title,
        },
        { merge: true }
    );
};

export const searchTeachersByName = async (name) => {
    const q = query(
                  collection(db, 'teachers'),
                  where('displayName', '==', name)
              )

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};