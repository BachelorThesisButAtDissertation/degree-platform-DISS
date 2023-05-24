import { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    ButtonToolbar,
    DateRangePicker,
    Form,
    InputNumber,
    Message,
    Modal,
    toaster,
} from 'rsuite';
import {
    getActiveSeasons,
    createNewPhase,
    removePhaseById,
} from '../../lib/admin/adminFunc';

const SeasonEdit = () => {
    const [phases, setPhases] = useState();
    const [phaseData, setPhaseData] = useState({
        interval: [],
        time: 0,
    });
    const [open, setOpen] = useState(false);

    const loadSessions = () => {
        getActiveSeasons()
            .then((res) => setPhases(res))
            .catch(console.error);
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const createPhase = () => {
        createNewPhase({
            deadline: phaseData.interval[1].getTime(),
            start: phaseData.interval[0].getTime(),
            timeUntilNext: phaseData.time,
        })
            .then((res) => {
                toaster(<Message>Phase has been added</Message>);
                setOpen(false);
                loadSessions();
                setPhaseData({
                    interval: [],
                    time: 0,
                });
            })
            .catch((err) => {
                console.error(err);

                toaster(
                    <Message type='error'>Something weird happened</Message>
                );
            });
    };

    const removePhase = (id) => {
        removePhaseById(id);
        loadSessions();
    };

    return (
        <>
            <div className={'pageTitle'}>
                <h2>Manage seasons</h2>
                <p>Define periods in which students can apply for a teacher.</p>
            </div>

            <ButtonToolbar
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <ButtonGroup>
                    <Button
                        appearance='primary'
                        color='green'
                        onClick={() => setOpen(true)}
                    >
                        Create season
                    </Button>
                </ButtonGroup>
            </ButtonToolbar>

            <div className='admin-season-details'>
                {phases?.map((phase) => (
                    <ul key={phase.id}>
                        <li>
                            <strong>Start:</strong>{' '}
                            {new Date(phase.start).toDateString()}
                        </li>
                        <li>
                            <strong>Deadline:</strong>{' '}
                            {new Date(phase.deadline).toDateString()}
                        </li>

                        <li>
                            <strong>Time till next:</strong>{' '}
                            {phase.timeUntilNext} week(s)
                        </li>
                        <li>
                            <Button
                                appearance='primary'
                                color='red'
                                onClick={() => removePhase(phase.id)}
                            >
                                Remove
                            </Button>
                        </li>
                    </ul>
                ))}
            </div>

            <Modal size={'sm'} open={open} onClose={() => setOpen(false)}>
                <Modal.Header>
                    <Modal.Title>Create new phase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        formValue={phaseData}
                        onChange={setPhaseData}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <Form.Group controlId='interval'>
                            <Form.ControlLabel>Interval</Form.ControlLabel>
                            <Form.Control
                                name='interval'
                                accepter={DateRangePicker}
                            />
                        </Form.Group>
                        <Form.Group controlId='time'>
                            <Form.ControlLabel>
                                Time until next request
                            </Form.ControlLabel>
                            <Form.Control
                                name='time'
                                accepter={InputNumber}
                                min={0}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setOpen(false)} appearance='subtle'>
                        Cancel
                    </Button>
                    <Button onClick={() => createPhase()} appearance='primary'>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SeasonEdit;
