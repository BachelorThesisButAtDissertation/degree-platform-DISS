import { useEffect, useState } from 'react';
import {
    Button,
    DatePicker,
    Form,
    Modal,
    Table,
    toaster,
    Message,
    Checkbox,
    ButtonToolbar,
    ButtonGroup,
    InputNumber,
} from 'rsuite';
import { openChat } from '../../lib/chat/chatFunc';
import {
    createCollaborationTask,
    markTaskAsDone,
    updateCollabTitle,
} from '../../lib/db/teacherDB';
import { getCollabTasks } from '../../lib/user/userFunc';
import Textarea from '../basics/Textarea';
import ArowBackIcon from '@rsuite/icons/ArowBack';
import { downloadAtURL, getFile } from '../../lib/storage/storageFunc';

const DateCell = ({ rowData, dataKey, ...props }) => (
    <Table.Cell {...props}>
        {isNaN(rowData[dataKey]) ? '-' : new Date(rowData[dataKey]).toDateString()}
    </Table.Cell>
  );

const StatusCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Table.Cell {...props}>
          {rowData.feedback || rowData.done}
      </Table.Cell>
    )
};


const Workspace = ({ collab, userId, setActiveChat, closeWorkspace }) => {
    const [tasks, setTasks] = useState([]);
    const [taskModal, setTaskModal] = useState(false);

    const [clickedTask, setClickedTask] = useState({});
    const [addGradeModal, setAddGradeModal] = useState(false);

    const [titleEdit, setTitleEdit] = useState(false);
    const [title, setTitle] = useState(collab.title);
    const [file, setFile] = useState();
    const [taskData, setTaskData] = useState({
        title: '',
        body: '',
        dueDate: null,
    });
    const [gradeData, setGradeData] = useState({
        grade: 0,
        feedback: '',
    })
    const loadData = async () => {
        await loadTasks(collab.id);
    };

    const loadTasks = async (collabId) => {
        const tks = await getCollabTasks(collabId);
        setTasks(
            tks.map((t) => ({
                ...t,
                dueDate: new Date(t.dueDate).toDateString(),
                completed: new Date(t.completedOn).toDateString(),
                done: t.status ? 'Done' : 'Unfinished',
            }))
        );
    };

    useEffect(() => {
        loadData();
        collab.files &&
            setFile({
                status: 'done',
                file: {
                    name: collab.files,
                },
            });
    }, []);

    const openNewChat = async () => {
        // console.log(collab.student.id, userId);
        const chatToOpen = await openChat(
            collab.student.id,
            userId,
            'teachers',
            'students'
        );
        setActiveChat({
            ...chatToOpen,
            to: chatToOpen.chatters.find((c) => c.id !== userId),
        });
    };

    const createTask = async () => {
        await createCollaborationTask(collab.id, {
            ...taskData,
            dueDate: taskData.dueDate.getTime(),
        });
        setTaskModal(false);
        toaster.push(<Message type='success'>Task has been created.</Message>);
        await loadTasks(collab.id);
    };

    const markAsDone = async () => {
        await markTaskAsDone(collab.id, clickedTask.id, gradeData.feedback, gradeData.grade);
        toaster.push(<Message type='success'>Task has been updated.</Message>);
        setTimeout(() => {
            loadTasks(collab.id);
        }, 500);
        setAddGradeModal(false);
    };

    const saveNewTitle = () => {
        updateCollabTitle(collab.id, title);
        setTitle(title);
        setTitleEdit(false);
    };

    const downloadFile = async () => {
        const url = await getFile(
            collab.student.id,
            `collabs/${collab.id}`,
            file.file.name
        );
        downloadAtURL(url, file.file.name);
    };

    return (
        <>
            <div className={'pageTitle'}>
                {titleEdit ? (
                    <Form layout='inline'>
                        <Form.Group controlId='title'>
                            <Form.ControlLabel>Title</Form.ControlLabel>
                            <Form.Control
                                name='title'
                                onChange={setTitle}
                                value={title}
                            />
                        </Form.Group>
                        <Button onClick={saveNewTitle}>Save</Button>
                    </Form>
                ) : (
                    <h2 onClick={() => setTitleEdit(true)}>{title}</h2>
                )}
                <p>Manage your collaboration with.</p>
            </div>

            <Modal
                size={'sm'}
                open={taskModal}
                onClose={() => setTaskModal(false)}
            >
                <Modal.Header>
                    <Modal.Title>Create new task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={setTaskData} formValue={taskData}>
                        <Form.Group controlId='title'>
                            <Form.ControlLabel>Title</Form.ControlLabel>
                            <Form.Control name='title' />
                        </Form.Group>
                        <Form.Group controlId='body'>
                            <Form.ControlLabel>
                                Task description
                            </Form.ControlLabel>
                            <Form.Control
                                rows={5}
                                name='body'
                                accepter={Textarea}
                            />
                        </Form.Group>
                        <Form.Group controlId='dueDate'>
                            <Form.ControlLabel>Deadline</Form.ControlLabel>
                            <Form.Control
                                name='dueDate'
                                accepter={DatePicker}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            setTaskModal(false);
                            setTaskData({});
                        }}
                        appearance='subtle'
                    >
                        Cancel
                    </Button>
                    <Button onClick={createTask} appearance='primary'>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
              size={'sm'}
              open={addGradeModal}
              onClose={() => setAddGradeModal(false)}
            >
                <Modal.Header>
                    <Modal.Title>{`Add a grade to the task "${clickedTask.title}"`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onChange={setGradeData} formValue={gradeData}>
                        <Form.Group controlId='feedback'>
                            <Form.ControlLabel>
                                Task feedback
                            </Form.ControlLabel>
                            <Form.Control
                              rows={5}
                              name='feedback'
                              accepter={Textarea}
                            />
                        </Form.Group>
                        <Form.Group controlId='grade'>
                            <Form.ControlLabel>Grade</Form.ControlLabel>
                            <Form.Control name='grade' accepter={InputNumber} max={10} min={1}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                      onClick={() => {
                          setAddGradeModal(false);
                      }}
                      appearance='subtle'
                    >
                        Cancel
                    </Button>
                    <Button onClick={markAsDone} appearance='primary'>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <ButtonToolbar
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <ButtonGroup>
                    <Button onClick={() => closeWorkspace()}>
                        <ArowBackIcon /> Go back
                    </Button>
                    <Button
                        appearance='primary'
                        onClick={() => setTaskModal(true)}
                    >
                        Create task
                    </Button>
                    <Button
                        appearance='primary'
                        color='green'
                        onClick={() => openNewChat()}
                    >
                        Open chat
                    </Button>
                    {file && (
                        <Button
                            appearance='primary'
                            color='violet'
                            onClick={() => downloadFile()}
                        >
                            Download latest version
                        </Button>
                    )}
                </ButtonGroup>
            </ButtonToolbar>

            <Table
                virtualized
                height={400}
                data={tasks}
                onRowClick={(data) => {
                    console.log(data);
                }}
            >
                {/*<Table.Column width={190} align='center' fixed>*/}
                {/*    <Table.HeaderCell>Task Id</Table.HeaderCell>*/}
                {/*    <Table.Cell dataKey='id' />*/}
                {/*</Table.Column>*/}

                <Table.Column width={220}>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.Cell dataKey='title' />
                </Table.Column>

                <Table.Column width={350}>
                    <Table.HeaderCell>Body</Table.HeaderCell>
                    <Table.Cell dataKey='body' />
                </Table.Column>

                <Table.Column width={150}>
                    <Table.HeaderCell>Due date</Table.HeaderCell>
                    <Table.Cell dataKey='dueDate' />
                </Table.Column>

                <Table.Column width={150}>
                    <Table.HeaderCell>Completed on</Table.HeaderCell>
                    <DateCell dataKey='completedOn'/>
                </Table.Column>

                <Table.Column width={350}>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <StatusCell dataKey='done' />
                </Table.Column>

                <Table.Column width={120}>
                    <Table.HeaderCell>Grade / Action</Table.HeaderCell>
                    <Table.Cell>
                        {(rowData) => (
                           !rowData.status ? (
                             <Checkbox
                               checked={rowData.status}
                               onChange={(_, val) => {
                                   setClickedTask(rowData);
                                   setAddGradeModal(true);
                               }}
                             >
                                 Done
                             </Checkbox>
                           ) : (
                            rowData.grade > 0 ? rowData.grade : '-'
                           )
                        )}
                    </Table.Cell>
                </Table.Column>
            </Table>
        </>
    );
};

export default Workspace;
