import { useEffect, useState } from 'react';
import { Table, toaster, Message, Modal, Button } from 'rsuite';
import {
    createCollaboration,
    getMyTeacherCollabs,
    getMyTeacherRequests,
    getTeacherDataByRef,
    updateRequestResponse,
} from '../../lib/db/teacherDB';
import {
    getMyStudentRequests,
    getStudDataByRef,
} from '../../lib/user/userFunc';
import Workspace from './Workspace';

const ListOfCollabs = ({ userId, setActiveChat }) => {
    const [requests, setRequests] = useState([]);
    const [focusCollab, setFocusCollab] = useState();
    const loadData = async () => {
        const data = await getMyTeacherCollabs(userId);
        let reqt = [];
        for (const req of data) {
            reqt.push({
                ...req,
                message: req.message || '-',
                agreedOn: req.agreedOn
                    ? new Date(req.agreedOn).toDateString()
                    : 'unknown',
                student: {
                    ...(await (await getStudDataByRef(req.student)).data()),
                    id: req.student.id,
                },
            });
        }
        setRequests(reqt);
    };

    useEffect(() => {
        loadData();
    }, []);

    const closeWorkspace = () => {
        setFocusCollab(null);
        loadData();
    };

    if (focusCollab) {
        return (
            <Workspace
                userId={userId}
                collab={focusCollab}
                setActiveChat={setActiveChat}
                closeWorkspace={closeWorkspace}
            />
        );
    }
    return (
        <>
            <div className={'pageTitle'}>
                <h2>Manage my students</h2>
                <p>Manage your collaboration with the students.</p>
            </div>

            <Table
                virtualized
                height={400}
                data={requests}
                onRowClick={(data) => {
                    console.log(data);
                }}
            >
                <Table.Column width={190} align='center' fixed>
                    <Table.HeaderCell>Id</Table.HeaderCell>
                    <Table.Cell dataKey='id' />
                </Table.Column>

                <Table.Column width={220}>
                    <Table.HeaderCell>Student</Table.HeaderCell>
                    <Table.Cell dataKey='student.displayName' />
                </Table.Column>

                <Table.Column width={300}>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.Cell dataKey='title' />
                </Table.Column>

                <Table.Column width={130}>
                    <Table.HeaderCell>Agreed on</Table.HeaderCell>
                    <Table.Cell dataKey='agreedOn' />
                </Table.Column>

                <Table.Column width={130} fixed='right'>
                    <Table.HeaderCell>Action</Table.HeaderCell>

                    <Table.Cell>
                        {(rowData) => (
                            <Button
                                appearance='primary'
                                size='xs'
                                onClick={() => setFocusCollab(rowData)}
                            >
                                View workspace
                            </Button>
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
        </>
    );
};

export default ListOfCollabs;
