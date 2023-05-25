import {  useState } from 'react';
import { Nav, Sidenav } from 'rsuite';
import styles from '../../styles/Home.module.css';
import AdminIcon from '@rsuite/icons/Admin';
import DocPassIcon from '@rsuite/icons/DocPass';

import TeacherList from '../search/TeacherList';
import ChatList from '../chat/ChatList';

import AccountLoader from '../AccountLoader';
import MyRequests from '../teacher/MyRequests';
import SetupTeacher from './SetupTeacher';
import ListOfCollabs from './ListOfCollabs';
import { TYPES } from '../../lib/user/userFunc';
import { useRouter } from 'next/router'
import ExitIcon from "@rsuite/icons/Exit";

const TeacherMode = ({ auth }) => {
    const [setupMode, setSetupMode] = useState('unset');
    const [page, setPage] = useState('requests');
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
                    mode='teachers'
                />
            )}
            {setupMode === 'setting' && (
                <SetupTeacher
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
                                          padding: "12px 20px",
                                          cursor: "default",
                                          marginBottom: 32,
                                          backgroundColor: "white",
                                          border: '5px solid #2962FF',
                                      }}
                                    >
                                        <img src='/logo.png' height='40' />
                                    </Nav.Item>
                                    <Nav.Item icon={<AdminIcon />} style={{ backgroundColor: "#2962FF",}}>
                                        Welcome,{' '}
                                        {
                                            auth?.currentUser?.providerData[0]
                                                .displayName
                                        }
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='requests'
                                        icon={<DocPassIcon />}
                                        style={{ backgroundColor: "#2962FF",}}
                                    >
                                        Requests
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='collaborations'
                                        icon={<DocPassIcon />}
                                        style={{ backgroundColor: "#2962FF",}}
                                    >
                                        Collaborations
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='logout'
                                        icon={<ExitIcon />}
                                        style={{ backgroundColor: "#2962FF",}}
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
                            <ListOfCollabs
                                setActiveChat={setActiveChat}
                                userId={auth.currentUser?.uid}
                            />
                        )}
                    </div>
                    <ChatList
                        activeChat={activeChat}
                        setActiveChat={setActiveChat}
                        userId={auth.currentUser?.uid}
                        mode={TYPES.TEACHER}
                    />
                </>
            )}
        </div>
    );
};

export default TeacherMode;
