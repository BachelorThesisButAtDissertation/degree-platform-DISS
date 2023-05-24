import {
    Button,
    ButtonToolbar,
    Form,
    Panel,
    Stack,
    Message,
    toaster,
} from 'rsuite';
import CreativeIcon from '@rsuite/icons/Creative';
import ExploreIcon from '@rsuite/icons/Explore';
import ShieldIcon from '@rsuite/icons/Shield';
import styles from '../styles/Auth.module.css';
import { useState } from 'react';

import firebase from '../lib/firebase';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { useRouter } from 'next/router';

const LoginOptions = {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
};

const ERROR_CODES = {
    'auth/email-already-in-use': 'This email is already in use.',
};

const AuthPage = () => {
    const auth = getAuth();
    const router = useRouter();
    const [loginMode, setLoginMode] = useState();
    const [registerForm, setRegisterForm] = useState(false);
    const [fdata, setFdata] = useState({
        email: '',
        password: '',
    });
    const [fregdata, setFregdata] = useState({
        name: '',
        email: '',
        password: '',
    });

    const toggleLogin = (mode) => {
        setLoginMode(mode);
    };

    const onLogin = () => {
        signInWithEmailAndPassword(auth, fdata.email, fdata.password)
            .then((uc) => {
                localStorage.setItem('user', JSON.stringify(uc));
                toaster.push(
                    <Message showIcon type='success'>
                        Welcome to the platform!
                    </Message>
                );
                router.push({
                    pathname: '/',
                    query: {
                        m: loginMode,
                    },
                });
            })
            .catch((err) => {
                const { code, message } = err;
                console.error(code, ' ||| ', message);
                if (ERROR_CODES[code]) {
                    toaster.push(
                        <Message showIcon type='error'>
                            {ERROR_CODES[code]}
                        </Message>
                    );
                }
            });
    };

    const onRegister = () => {
        createUserWithEmailAndPassword(auth, fregdata.email, fregdata.password)
            .then((uc) => {
                localStorage.setItem('user', JSON.stringify(uc));
                toaster.push(
                    <Message showIcon type='success'>
                        Welcome to the platform!
                    </Message>
                );
                console.log(auth.currentUser, uc);
                updateProfile(auth.currentUser, {
                    providerData: {
                        displayName: fregdata?.name,
                    },
                })
                    .then(console.log)
                    .catch(console.error);
                router.push({
                    pathname: '/',
                });
            })
            .catch((err) => {
                const { code, message } = err;
                if (ERROR_CODES[code]) {
                    toaster.push(
                        <Message showIcon type='error'>
                            {ERROR_CODES[code]}
                        </Message>
                    );
                }
            });
    };

    return (
        <div className={styles.container}>
            <Panel header='Welcome' shaded>
                <p>Select your login below.</p>

                {!loginMode && !registerForm && (
                    <Stack
                        direction='column'
                        alignItems='stretch'
                        justifyContent='flex-end'
                        spacing={5}
                        className={styles.options}
                    >
                        <Button
                            size='lg'
                            appearance='primary'
                            onClick={() => toggleLogin(LoginOptions.STUDENT)}
                        >
                            <CreativeIcon /> I am a student
                        </Button>
                        <Button
                            size='lg'
                            appearance='primary'
                            onClick={() => toggleLogin(LoginOptions.TEACHER)}
                        >
                            <ExploreIcon /> I am a teacher
                        </Button>
                        <Button
                            size='lg'
                            appearance='primary'
                            onClick={() => toggleLogin(LoginOptions.ADMIN)}
                        >
                            <ShieldIcon /> I am an admin
                        </Button>
                        <Button
                            size='lg'
                            appearance='default'
                            onClick={() => setRegisterForm(true)}
                        >
                            Create an account
                        </Button>
                    </Stack>
                )}

                {loginMode && (
                    <>
                        <Form
                            className={styles.loginForm}
                            formValue={fdata}
                            onChange={setFdata}
                            onSubmit={onLogin}
                        >
                            <Form.Group controlId='email'>
                                <Form.ControlLabel>Email</Form.ControlLabel>
                                <Form.Control name='email' />
                            </Form.Group>
                            <Form.Group controlId='password'>
                                <Form.ControlLabel>Password</Form.ControlLabel>
                                <Form.Control name='password' type='password' />
                            </Form.Group>
                            <Form.Group>
                                <ButtonToolbar>
                                    <Button appearance='primary' type='submit'>
                                        Continue
                                    </Button>
                                    <Button
                                        size='lg'
                                        appearance='subtle'
                                        onClick={() => toggleLogin(null)}
                                    >
                                        Back
                                    </Button>
                                </ButtonToolbar>
                            </Form.Group>
                        </Form>
                    </>
                )}

                {registerForm && (
                    <Form
                        className={styles.loginForm}
                        formValue={fregdata}
                        onChange={setFregdata}
                        onSubmit={onRegister}
                    >
                        <Form.Group controlId='name'>
                            <Form.ControlLabel>Full Name</Form.ControlLabel>
                            <Form.Control name='name' />
                        </Form.Group>
                        <Form.Group controlId='email'>
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control name='email' />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.ControlLabel>Password</Form.ControlLabel>
                            <Form.Control name='password' type='password' />
                        </Form.Group>
                        <Form.Group>
                            <ButtonToolbar>
                                <Button appearance='primary' type='submit'>
                                    Continue
                                </Button>
                                <Button
                                    size='lg'
                                    appearance='subtle'
                                    onClick={() => setRegisterForm(false)}
                                >
                                    Back
                                </Button>
                            </ButtonToolbar>
                        </Form.Group>
                    </Form>
                )}
            </Panel>
        </div>
    );
};

export default AuthPage;
