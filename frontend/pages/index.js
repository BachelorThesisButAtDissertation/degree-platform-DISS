import withAuth from '../lib/withAuth';
import { getAuth } from 'firebase/auth';
import StudentMode from '../components/student/StudentHome';
import { useRouter } from 'next/router';
import TeacherMode from '../components/teacher/TeacherHome';
import AdminMode from '../components/admin/AdminHome';

const LoginOptions = {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
};

const Home = (props) => {
    const router = useRouter();
    const mode = router?.query?.m;
    const auth = getAuth();

    return (
        <>
            {mode === LoginOptions.STUDENT && <StudentMode auth={auth} />}
            {mode === LoginOptions.TEACHER && <TeacherMode auth={auth} />}
            {mode === LoginOptions.ADMIN && <AdminMode auth={auth} />}
        </>
    );
};

export default withAuth(Home);
