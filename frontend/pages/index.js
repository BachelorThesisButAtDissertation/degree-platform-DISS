import withAuth from '../lib/withAuth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import StudentMode from '../components/student/StudentHome';
import { useRouter } from 'next/router';
import TeacherMode from '../components/teacher/TeacherHome';
import AdminMode from '../components/admin/AdminHome';
import {useEffect, useState} from "react";

const LoginOptions = {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
};

const Home = (props) => {
    const router = useRouter();
    const mode = router?.query?.m;
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        })
    }, []);

    console.log('SPER CA MERGE');

    return (
        <>
            {mode === LoginOptions.STUDENT && <StudentMode currentUser={currentUser} />}
            {mode === LoginOptions.TEACHER && <TeacherMode auth={auth} />}
            {mode === LoginOptions.ADMIN && <AdminMode currentUser={currentUser} />}
        </>
    );
};

export default withAuth(Home);
