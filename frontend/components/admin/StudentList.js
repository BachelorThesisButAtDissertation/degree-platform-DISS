import {useEffect, useState} from 'react'
import { Table, Checkbox, Button, Modal, Input, toaster, Message } from 'rsuite'
import { getAllStudents, getUserData, getCollaborationById, getStudentRef } from '../../lib/user/userFunc'
import { searchTeachersByName, createCollaboration, getTeachRef, getTeacherDataByRef } from '../../lib/db/teacherDB'
import Workspace from '../teacher/Workspace'
import TeacherCard from '../search/TeacherCard'

const StudentList = () => {
    const [clb, setClb] = useState(false)
    const [students, setStudents] = useState()
    const [activeCollab, setActiveCollab] = useState()
    const [activeStud, setActiveStud] = useState()
    const [open, setOpen] = useState(false)
    const [teachers, setTeachers] = useState([])
    const [searchName, setSearchName] = useState('')

    const loadStudents = () => {
        console.log('<< ----- HERE ----- >>');
        getAllStudents(clb)
        .then(async res => {
            let finalRes = []
            for(const st of res) {
                const collabData = (await getCollaborationById(st.activeCollaboration.id)).data()
                const coordinator = (await getTeacherDataByRef(collabData.coordinator)).data()
                console.log(coordinator)
                finalRes.push({
                ...st,
                activeCollaborationData: {
                    ...collabData,
                    id: st.activeCollaboration.id,
                    agreedOnFormat: new Date(collabData.agreedOn).toDateString(),
                    coordinatorData: coordinator,
                }
            })
            }
            console.log(finalRes)
            setStudents(finalRes)
        })
        .catch(console.error)
    }

    useEffect(() => {
        loadStudents()
    }, [clb])

    const handleClose = () => {
        setOpen(false)
        setActiveStud()
    }

    const handleSearch = async () => {
        setTeachers(await searchTeachersByName(searchName))
    }

    const createCollab = (teacherId, studentId) => {
        createCollaboration({
            to: getTeachRef(teacherId),
            from: getStudentRef(studentId),
            title: 'Untitled yet',
            agreedOn: Date.now(),
            id: Date.now()
        })
        toaster(<Message type='success'>Student has been assigned</Message>)
        setOpen(false)
        loadStudents()
    }

    if(activeCollab) return <Workspace collab={activeCollab} closeWorkspace={() => setActiveCollab(null)}/>
    return (
        <>
            <div className={'pageTitle'}>
                <h2>Manage students</h2>
                <p>Watch their collabs, create new collabs.</p>
            </div>

            <Checkbox value={clb} onChange={(_, val) => setClb(val)} >With active collaborations.</Checkbox>

            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                <Modal.Title>Assign a teacher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Input value={searchName} onChange={setSearchName} placeholder='Search teacher by name'/>
                    <Button onClick={handleSearch}>Search</Button>

                    {
                        teachers?.map(teach => (
                            <TeacherCard
                                key={teach.id}
                                {...teach}
                                adminView
                                searchMode
                                fupd={() => {}}
                                onSelect={() => createCollab(teach.id, activeStud.id)}
                            />
                        ))
                    }
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={handleClose} appearance="primary">
                    Ok
                </Button>
                <Button onClick={handleClose} appearance="subtle">
                    Cancel
                </Button>
                </Modal.Footer>
            </Modal>

            <Table
                virtualized
                height={400}
                data={students}
                onRowClick={(data) => {
                    clb && setActiveCollab(data.activeCollaborationData)
                }}
            >
                <Table.Column width={190} align='center' fixed>
                    <Table.HeaderCell>Id</Table.HeaderCell>
                    <Table.Cell dataKey='id' />
                </Table.Column>

                <Table.Column width={220}>
                    <Table.HeaderCell>Student</Table.HeaderCell>
                    <Table.Cell dataKey='displayName' />
                </Table.Column>

                <Table.Column width={220}>
                    <Table.HeaderCell>Teacher</Table.HeaderCell>
                    <Table.Cell dataKey='activeCollaborationData.coordinatorData.displayName' />
                </Table.Column>

                <Table.Column width={300}>
                    <Table.HeaderCell>Colalboration title</Table.HeaderCell>
                    <Table.Cell dataKey='activeCollaborationData.title' />
                </Table.Column>

                <Table.Column width={150}>
                    <Table.HeaderCell>Agreed on</Table.HeaderCell>
                    <Table.Cell dataKey='activeCollaborationData.agreedOnFormat' />
                </Table.Column>

                {!clb && <Table.Column width={150}>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.Cell>{data => (<Button size='xs' onClick={() => {
                        setActiveStud(data)
                        setOpen(true)
                    }}>Assign teacher</Button>)}</Table.Cell>
                </Table.Column>}
            </Table>
        </>
    )
}

export default StudentList
