import { useEffect, useState } from 'react';
import { Table } from 'rsuite';
import { getTeacherDataByRef } from '../../lib/db/teacherDB';
import { getMyStudentRequests } from '../../lib/user/userFunc';

const MyRequests = ({ userId }) => {
    const [requests, setRequests] = useState([]);
    const loadData = async () => {
        const data = await getMyStudentRequests(userId);
        let reqt = [];
        for (const req of data) {
            reqt.push({
                ...req,
                message: req.message || '-',
                time: req.time ? new Date(req.time).toDateString() : 'unknown',
                to: await (await getTeacherDataByRef(req.to)).data(),
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
                    <Table.HeaderCell>Teacher</Table.HeaderCell>
                    <Table.Cell dataKey='to.displayName' />
                </Table.Column>

                <Table.Column width={300}>
                    <Table.HeaderCell>Message</Table.HeaderCell>
                    <Table.Cell dataKey='message' />
                </Table.Column>

                <Table.Column width={130}>
                    <Table.HeaderCell>Sent on</Table.HeaderCell>
                    <Table.Cell dataKey='time' />
                </Table.Column>

                <Table.Column width={130}>
                    <Table.HeaderCell>Response</Table.HeaderCell>
                    <Table.Cell dataKey='response' />
                </Table.Column>
            </Table>
        </>
    );
};

export default MyRequests;
