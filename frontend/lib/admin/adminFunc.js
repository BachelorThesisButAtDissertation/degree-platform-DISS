import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    setDoc,
    where,
    deleteDoc,
} from 'firebase/firestore';
import fbapp from '../firebase';

const db = getFirestore(fbapp);

export const getAdminData = async (userId) => {
    return await getDoc(doc(db, 'admins', userId));
};

export const getActiveSeasons = async () => {
    const q = query(collection(db, 'phases'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const getActiveSeasonsImIn = async () => {
    const q = query(
        collection(db, 'phases'),
        where('deadline', '>=', Date.now())
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const createNewPhase = async (phaseData) => {
    const set = setDoc(doc(db, 'phases', `ph-${Date.now()}`), phaseData);
    if (phaseData.start <= Date.now() && phaseData.deadline >= Date.now()) {
        await updateStudentsByPhase(phaseData);
    }
    return set;
};

export const removePhaseById = (phid) => {
    return deleteDoc(doc(db, 'phases', phid));
};

export const updateStudentsByPhase = async (phase) => {
    const q = query(collection(db, 'students'));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setDoc(
            doc.ref,
            {
                nextPossibleRequest: phase.start,
                requests: 1,
            },
            { merge: true }
        );
    });
};
