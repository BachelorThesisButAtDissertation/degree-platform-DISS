import { useState } from 'react';
import { Nav, Sidenav } from 'rsuite';
import styles from '../../styles/Home.module.css';
import AdminIcon from '@rsuite/icons/Admin';
import DocPassIcon from '@rsuite/icons/DocPass';
import CalendarIcon from '@rsuite/icons/Calendar';
import PeoplesIcon from '@rsuite/icons/Peoples';

import ChatList from '../chat/ChatList';

import AccountLoader from '../AccountLoader';
import SeasonEdit from './SeasonEdit';
import TeacherList from './TeacherList';
import StudentList from './StudentList';
import { TYPES } from '../../lib/user/userFunc';
import { useRouter } from 'next/router'

const AdminMode = ({ currentUser }) => {
    const [setupMode, setSetupMode] = useState('unset');
    const [page, setPage] = useState('seasons');
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
                    userId={currentUser?.uid}
                    setAccountSetup={setAccountSetup}
                    mode='admins'
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
                                        Welcome{' '}
                                        {
                                            currentUser?.providerData[0]
                                                .displayName
                                        }
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='seasons'
                                        icon={<CalendarIcon />}
                                    >
                                        Seasons
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='teachers'
                                        icon={<DocPassIcon />}
                                    >
                                        Teachers
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='students'
                                        icon={<PeoplesIcon />}
                                    >
                                        Students
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey='logout'
                                    >
                                        Logout
                                    </Nav.Item>
                                </Nav>
                            </Sidenav.Body>
                        </Sidenav>
                    </div>

                    <div className={styles.main}>
                        {page === 'seasons' && (
                            <SeasonEdit userId={currentUser?.uid} />
                        )}
                        {page === 'teachers' && (
                            <TeacherList
                                userId={currentUser?.uid}
                                setActiveChat={setActiveChat}
                            />
                        )}
                        {page === 'students' && (
                            <StudentList
                                userId={currentUser?.uid}
                                setActiveChat={setActiveChat}
                            />
                        )}
                    </div>
                    <ChatList
                        activeChat={activeChat}
                        setActiveChat={setActiveChat}
                        userId={currentUser?.uid}
                        mode={TYPES.ADMIN}
                    />
                </>
            )}
        </div>
    );
};

export default AdminMode;
