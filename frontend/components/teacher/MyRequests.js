import { useEffect, useState } from 'react';
import { Table, toaster, Message } from 'rsuite';
import {
    createCollaboration,
    getMyTeacherRequests,
    getTeacherDataByRef,
    updateRequestResponse,
} from '../../lib/db/teacherDB';
import {
    getMyStudentRequests,
    getStudDataByRef,
} from '../../lib/user/userFunc';

const ActionCell = ({ rowData, callBack }) => {
    console.log('comp', rowData);
    const handleAction = (resp) => {
        updateRequestResponse(rowData.id, resp);

        callBack();
        switch (resp) {
            case 'ACCEPTED':
                createCollaboration(rowData);
                toaster.push(
                    <Message type='success'>
                        Request {rowData.id} was accepted.
                    </Message>
                );
                return;
            default:
                toaster.push(
                    <Message type='error'>
                        Request {rowData.id} was rejected.
                    </Message>
                );
                return;
        }
    };
    return (
        <span>
            <a onClick={() => handleAction('ACCEPTED')}> Accept </a> |{' '}
            <a onClick={() => handleAction('REJECTED')}> Reject </a>
        </span>
    );
};

const MyRequests = ({ userId }) => {
    const [requests, setRequests] = useState([]);
    const loadData = async () => {
        const data = await getMyTeacherRequests(userId);
        let reqt = [];
        for (const req of data) {
            reqt.push({
                ...req,
                message: req.message || '-',
                time: req.time ? new Date(req.time).toDateString() : 'unknown',
                fromParsed: await (await getStudDataByRef(req.from)).data(),
            });
        }
        setRequests(reqt);
    };

    console.log(requests);

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <div className={'pageTitle'}>
                <h2>My Requests</h2>
                <p>
                    Manage your requests to the teachers and watch their answer.
                </p>
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
                    <Table.HeaderCell>From student</Table.HeaderCell>
                    <Table.Cell dataKey='fromParsed.displayName' />
                </Table.Column>

                <Table.Column width={300}>
                    <Table.HeaderCell>Message</Table.HeaderCell>
                    <Table.Cell dataKey='message' />
                </Table.Column>

                <Table.Column width={130}>
                    <Table.HeaderCell>Sent on</Table.HeaderCell>
                    <Table.Cell dataKey='time' />
                </Table.Column>

                <Table.Column width={120} fixed='right'>
                    <Table.HeaderCell>Action</Table.HeaderCell>

                    <Table.Cell>
                        {(rowData) => (
                            <ActionCell rowData={rowData} callBack={loadData} />
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
        </>
    );
};

export default MyRequests;
