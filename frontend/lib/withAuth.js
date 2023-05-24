import React, { useEffect } from 'react';
import router from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import fbinit from './firebase';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const withAuth = (Component) => {
    const AuthBarrier = (props) => {
        useEffect(() => {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
                if (
                    userData?.stsTokenManager?.expirationTime <
                    Date.now() + 3600 * 1000
                ) {
                    router.push('/auth');
                }
            }
            auth.onAuthStateChanged((authUser) => {
                if (!authUser) {
                    router.push('/auth');
                }
            });
        }, []);

        return (
            <div>
                <Component {...props} />
            </div>
        );
    };

    return AuthBarrier;
};

export default withAuth;
