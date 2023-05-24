import { useEffect, useState } from 'react';
import { Button, Loader, Table, Uploader } from 'rsuite';
import { getTeacherDataByRef } from '../../lib/db/teacherDB';
import {
    getCollabTasks,
    getMyCollabsStud,
    getMyStudentRequests,
    uploadCollabFile,
} from '../../lib/user/userFunc';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { downloadAtURL, getFile } from '../../lib/storage/storageFunc';
import { openChat } from '../../lib/chat/chatFunc';

const MyCollabs = ({ userId, setActiveChat }) => {
    const [tasks, setTasks] = useState([]);
    const [collab, setCollab] = useState();
    const [file, setFile] = useState({
        status: 'none',
        file: null,
    });

    const loadTasks = async (collabId) => {
        const tks = await getCollabTasks(collabId);
        setTasks(
            tks.map((t) => ({
                ...t,
                dueDate: new Date(t.duedate).toDateString(),
                done: t.done ? 'Done' : 'Unfinished',
            }))
        );
    };

    const loadData = async () => {
        const data = await getMyCollabsStud(userId);
        let reqt = [];
        if (data.length > 0) {
            const coord = await getTeacherDataByRef(data[0].coordinator);
            setCollab({
                ...data[0],
                message: data[0].message || '-',
                time: data[0].time
                    ? new Date(data[0].time).toDateString()
                    : 'unknown',
                coordinator: { id: coord.id, ...(await coord.data()) },
            });
            loadTasks(data[0].id);
            data[0].files &&
                setFile({
                    status: 'done',
                    file: {
                        name: data[0].files,
                    },
                });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const uploadFile = async (file) => {
        setFile({
            status: 'uploading',
            file: file.blob,
        });
        await uploadCollabFile(userId, collab.id, file.blobFile);
        setFile({
            status: 'done',
            file: file.blob,
        });
    };

    const downloadFile = async () => {
        const url = await getFile(
            userId,
            `collabs/${collab.id}`,
            file.file.name
        );
        downloadAtURL(url, file?.file?.name);
    };

    const openNewChat = async () => {
        console.log(collab.coordinator);
        const chatToOpen = await openChat(
            userId,
            collab.coordinator.id,
            'students',
            'teachers'
        );
        setActiveChat({
            ...chatToOpen,
            to: chatToOpen.chatters.find((c) => c.id !== userId),
        });
    };

    return (
        <>
            <div className={'pageTitle'}>
                <h2>{collab?.title || 'My Requests'}</h2>
                <p>
                    Coordinator:{' '}
                    <strong>{collab?.coordinator.displayName}</strong>.
                </p>
                <Button
                    appearance='primary'
                    color='green'
                    onClick={() => openNewChat()}
                >
                    Open chat
                </Button>
            </div>

            <Table
                virtualized
                height={400}
                data={tasks}
                onRowClick={(data) => {
                    console.log(data);
                }}
            >
                <Table.Column width={190} align='center' fixed>
                    <Table.HeaderCell>Task Id</Table.HeaderCell>
                    <Table.Cell dataKey='id' />
                </Table.Column>

                <Table.Column width={220}>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.Cell dataKey='title' />
                </Table.Column>

                <Table.Column width={450}>
                    <Table.HeaderCell>Body</Table.HeaderCell>
                    <Table.Cell dataKey='message' />
                </Table.Column>

                <Table.Column width={130}>
                    <Table.HeaderCell>Due date</Table.HeaderCell>
                    <Table.Cell dataKey='dueDate' />
                </Table.Column>

                <Table.Column width={100}>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.Cell dataKey='done' />
                </Table.Column>
            </Table>

            <div>
                <h5>Upload your latest version</h5>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    {file.status !== 'uploading' && (
                        <Uploader
                            multiple
                            listType='picture'
                            action=''
                            onUpload={uploadFile}
                            style={{ marginBottom: 10 }}
                        >
                            <button>
                                <FileUploadIcon />
                            </button>
                        </Uploader>
                    )}
                    {file.status === 'uploading' && <Loader size='lg' />}
                    {file.status === 'done' && (
                        <Button appearance='primary' onClick={downloadFile}>
                            Download {file.file.name}
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyCollabs;
