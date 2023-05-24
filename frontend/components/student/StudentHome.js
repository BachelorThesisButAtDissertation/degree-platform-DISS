import { useEffect, useState } from 'react';
import { Nav, Sidenav } from 'rsuite';
import SetupUser from './Setup';
import styles from '../../styles/Home.module.css';
import DashboardIcon from '@rsuite/icons/Dashboard';
import PeoplesIcon from '@rsuite/icons/Peoples';
import AdminIcon from '@rsuite/icons/Admin';
import DocPassIcon from '@rsuite/icons/DocPass';

import TeacherCard from '../search/TeacherCard';
import TeacherList from '../search/TeacherList';
import ChatList from '../chat/ChatList';

import AccountLoader from '../AccountLoader';
import MyRequests from '../student/MyRequests';
import MyCollabs from '../student/MyCollaboration';
import { useRouter } from 'next/router'

const StudentMode = ({ auth }) => {
    const [setupMode, setSetupMode] = useState('unset');
    const [page, setPage] = useState('explore');
    const [activeChat, setActiveChat] = useState();
    const router = useRouter()

    const setAccountSetup = (mode = 'setting') => {
        setSetupMode(mode);
    };
    const endSetupMode = () => {
        setSetupMode('set');
    };

    return (
        <div className={styles.container}>
            {setupMode === 'unset' && (
                <AccountLoader
                    userId={auth.currentUser?.uid}
                    setAccountSetup={setAccountSetup}
                    mode='students'
                />
            )}
            {setupMode === 'setting' && (
                <SetupUser
                    userId={auth?.currentUser?.uid}
                    endSetupMode={endSetupMode}
                />
            )}

            {setupMode === 'set' && (
                <>
                    <div className={styles.sidebarWrap}>
                        <Sidenav
                            defaultOpenKeys={['3', '4']}
                            className={styles.sidenav}
                            appearance='inverse'
                        >
                            <Sidenav.Body>
                                <Nav
                                    activeKey={page}
                                    onSelect={(page) => {
                                        if(page === 'logout') router.push('/auth')
                                        else setPage(page)
                                    }}
                                >
                                    <Nav.Item
                                        style={{
                                            padding: 12,
                                        }}
                                    >
                                        <img src='/logo.png' height='40' />
                                    </Nav.Item>
                                    <Nav.Item icon={<AdminIcon />}>
                                        Welcome,{' '}
                                        {
                                            auth?.currentUser?.providerData[0]
                                                .displayName
                                        }
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='explore'
                                        icon={<DashboardIcon />}
                                    >
                                        Explore
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='requests'
                                        icon={<DocPassIcon />}
                                    >
                                        Requests
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='collaborations'
                                        icon={<DocPassIcon />}
                                    >
                                        Collaborations
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='logout'
                                    >
                                        Logout
                                    </Nav.Item>
                                    {/* <Nav.Item eventKey='2' icon={<PeoplesIcon />}>
                                User Group
                            </Nav.Item> */}
                                </Nav>
                            </Sidenav.Body>
                        </Sidenav>
                    </div>

                    <div className={styles.main}>
                        {page === 'explore' && (
                            <TeacherList
                                activeChat={activeChat}
                                setActiveChat={setActiveChat}
                                userId={auth.currentUser?.uid}
                            />
                        )}
                        {page === 'requests' && (
                            <MyRequests userId={auth.currentUser?.uid} />
                        )}
                        {page === 'collaborations' && (
                            <MyCollabs
                                setActiveChat={setActiveChat}
                                userId={auth.currentUser?.uid}
                            />
                        )}
                    </div>
                    <ChatList
                        activeChat={activeChat}
                        setActiveChat={setActiveChat}
                        userId={auth.currentUser?.uid}
                    />
                </>
            )}
        </div>
    );
};

export default StudentMode;
