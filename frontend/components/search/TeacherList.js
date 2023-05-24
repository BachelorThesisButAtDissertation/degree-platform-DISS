import TeacherCard from './TeacherCard';
import { Message, TagPicker } from 'rsuite';
import styles from '../../styles/Home.module.css';
import { useEffect, useState, useMemo } from 'react';
import { searchTeachers } from '../../lib/db/teacherDB';
import DOMAINS from '../../utils/domains.json';
import { getActiveSeasonsImIn } from '../../lib/admin/adminFunc';
import {getUserData, TYPES} from '../../lib/user/userFunc';

const TeacherList = ({ userId, setActiveChat }) => {
    const [teachers, setTeachers] = useState();
    const [domains, setDomains] = useState();
    const [interests, setInterests] = useState([]);
    const [_fu, _setFu] = useState(Date.now());
    const [userData, setUserData] = useState();
    const [seasons, setSeasons] = useState([]);
    const hasActiveCollab = useMemo(() => {
        const user = userData || JSON.parse(localStorage.getItem('userData'));
        return user.hasActiveCollaboration;
    }, [userData]);
    const openSeason = useMemo(() => {
        return seasons?.length > 0;
    }, [userData, seasons]);
    const cooldown = useMemo(() => {
        const user = userData || JSON.parse(localStorage.getItem('userData'));
        return user.nextPossibleRequest > Date.now();
    }, [userData]);

    const loadData = async () => {
        const user = JSON.parse(localStorage.getItem('userData'));
        setInterests(user.interests);
        setDomains(user.interests);
        const result = await searchTeachers(user.interests);
        setTeachers(result);
        const seasonsReq = await getActiveSeasonsImIn();
        setSeasons(seasonsReq);
    };
    useEffect(() => {
        loadData();
        resetPage();
    }, []);

    console.log(hasActiveCollab, openSeason, cooldown, seasons);

    const onSelectDomains = async (sel) => {
        if (!sel) {
            setTeachers([]);
            return;
        }
        let list = [];
        if (sel.includes('MINE1')) {
            list = interests;
        } else {
            list = sel;
        }
        setDomains(list);
        const result = await searchTeachers(list);
        setTeachers(result);
    };

    const resetPage = async () => {
        const udat = (await getUserData(userId)).data();
        setUserData(udat);
        localStorage.setItem('userData', JSON.stringify(udat));
        _setFu(Date.now());
    };

    return (
        <>
            <div className={styles.pageTitle}>
                <h2>Searching a teacher</h2>
                <p>Pick your teacher by the domain you are interested in.</p>
                {(hasActiveCollab || cooldown) && (
                    <Message type='warning' closable>
                        You cannot send any request for this time until{' '}
                        {new Date(userData?.nextPossibleRequest).toDateString()}.
                    </Message>
                )}
                {!openSeason && (
                    <Message type='warning' closable>
                        Request phase is not open at this time.
                    </Message>
                )}
            </div>

            <div className=''>
                <TagPicker
                    data={[
                        {
                            label: 'Only mine',
                            value: 'MINE1',
                            group: 'My domains',
                        },
                        ...Object.keys(DOMAINS).map((dom) => ({
                            label: dom,
                            value: dom,
                        })),
                    ]}
                    value={domains}
                    placeholder='Filter by'
                    groupBy='group'
                    style={{ width: 'auto' }}
                    onChange={onSelectDomains}
                    onClean={() => setDomains([])}
                />
            </div>

            <div className={styles.teacherCardList}>
                {teachers?.map((teach) => (
                    <TeacherCard
                        interests={domains}
                        key={teach.id}
                        {...teach}
                        userId={userId}
                        setActiveChat={setActiveChat}
                        canRequest={!hasActiveCollab && openSeason && !cooldown}
                        fupd={resetPage}
                        seasons={seasons}
                        mode={TYPES.STUDENT}
                    />
                ))}
            </div>
        </>
    );
};

export default TeacherList;
