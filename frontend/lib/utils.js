import { getDoc } from 'firebase/firestore';

export const getDocByRef = async (tref) => {
    const doc = await getDoc(tref);
    const docData = await doc.data();
    return {
        id: doc.id,
        ...docData,
    };
};
