import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFileForUser = async (userId, folder, file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `${userId}/${folder}/${file.name}`);

    return uploadBytes(storageRef, file);
};

export const getImageURL = (userId, filename) => {
    const storage = getStorage();
    const storageRef = ref(storage, `${userId}/avatars/${filename}`);
    return getDownloadURL(storageRef);
};

export const getFile = async (userId, path, filename) => {
    const storage = getStorage();
    const storageRef = ref(storage, `${userId}/${path}/${filename}`);
    return getDownloadURL(storageRef);
};

export const downloadAtURL = (dataurl, filename) => {
    const link = document.createElement('a');
    link.href = dataurl;
    link.target = '_blank';
    link.download = filename;
    link.click();
};
