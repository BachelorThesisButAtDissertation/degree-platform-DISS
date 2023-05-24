import styles from '../styles/AccountLoader.module.css';
import { Loader } from 'rsuite';
import { useEffect } from 'react';
import { getUserData } from '../lib/user/userFunc';
import { getTeacherData } from '../lib/db/teacherDB';
import { getAdminData } from '../lib/admin/adminFunc';

const GET_DATA = {
    students: getUserData,
    teachers: getTeacherData,
    admins: getAdminData,
};

const AccountLoader = ({ userId, setAccountSetup, mode }) => {
    const loadingAccountData = async () => {
        console.log('mode ------------------->> ', mode);
        const userData = (await GET_DATA[mode]?.(userId)).data();
        console.log('exists', userData);
        if (!userData) {
            setAccountSetup();
        } else {
            setAccountSetup('set');
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    };

    useEffect(() => {
        if (userId) {
            loadingAccountData();
        }
        console.log('uid', userId);
    }, [userId]);

    console.log('<< ----- HEREE ----- >>');

    return (
        <div className={styles.container}>
            <div className={styles.message}>
                <img src='/logo.png' height='50' />
                <Loader size='md' content='Loading account data' vertical />
            </div>
        </div>
    );
};

export default AccountLoader;
