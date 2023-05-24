import TeacherCard from '../search/TeacherCard';
import { Message, TagPicker } from 'rsuite';
import styles from '../../styles/Home.module.css';
import { useEffect, useState, useMemo } from 'react';
import { searchTeachers } from '../../lib/db/teacherDB';
import DOMAINS from '../../utils/domains.json';
import { getActiveSeasonsImIn } from '../../lib/admin/adminFunc';
import { getUserData, TYPES } from '../../lib/user/userFunc';

const TeacherList = ({ userId, setActiveChat }) => {
    const [teachers, setTeachers] = useState();
    const [domains, setDomains] = useState();
    const [interests, setInterests] = useState([]);
    const [_fu, _setFu] = useState(Date.now());
    const [userData, setUserData] = useState();
    const [seasons, setSeasons] = useState([]);

    const loadData = async () => {
        const result = await searchTeachers();
        setTeachers(result);
        const seasonsReq = await getActiveSeasonsImIn();
        setSeasons(seasonsReq);
    };
    useEffect(() => {
        loadData();
    }, []);

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

    return (
        <>
            <div className={styles.pageTitle}>
                <h2>Searching a teacher</h2>
                <p>Manage teachers.</p>
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
                        adminView
                        fupd={() => {}}
                        seasons={seasons}
                        mode={TYPES.ADMIN}
                    />
                ))}
            </div>
        </>
    );
};

export default TeacherList;
