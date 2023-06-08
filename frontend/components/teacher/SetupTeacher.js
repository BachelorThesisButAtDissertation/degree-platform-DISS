import { useState } from 'react';
import {
    Button,
    ButtonToolbar,
    Form,
    Loader,
    SelectPicker,
    TagPicker,
    Uploader,
} from 'rsuite';
import ImageIcon from '@rsuite/icons/Image';

import styles from '../../styles/student/Setup.module.css';
import DOMAINS from '../../utils/domains.json';
import ROLES from '../../utils/roles.json';
import { getImageURL, uploadFileForUser } from '../../lib/storage/storageFunc';
import {
    updateProfileData,
} from '../../lib/user/userFunc';
import { createTeacherInDB } from '../../lib/db/teacherDB';

const SetupTeacher = ({ userId, endSetupMode }) => {
    const [fdata, setFdata] = useState({
        displayName: '',
        photo: null,
        domains: [],
        address: '',
        role: '',
        website: '',
    });
    const [uploading, setUploading] = useState(false);
    console.log(userId);

    const handleProfilePicture = async (data) => {
        try {
            setUploading(true);
            const uploadRes = await uploadFileForUser(
                userId,
                'avatars',
                data.blobFile
            );
            const url = await getImageURL(userId, data.blobFile.name);
            setFdata({
                ...fdata,
                photo: [
                    {
                        name: data.blobFile.name,
                        fileKey: data.blobFile.name,
                        url,
                    },
                ],
            });
        } catch {
        } finally {
            setUploading(false);
        }
    };

    const saveChanges = async () => {
        await updateProfileData({
            displayName: fdata.displayName,
            photoURL: fdata.photo?.[0].url,
        });
        await createTeacherInDB(userId, {
            ...fdata,
            photo: fdata.photo?.[0].name,
            requests: 3,
            available: true,
        });
        localStorage.setItem('userData', JSON.stringify(fdata));
        endSetupMode();
    };

    return (
        <>
            <div className={styles.pageTitle}>
                <h2>Setup your account</h2>
                <p>Before you can start, we need to know more about you.</p>
            </div>

            <div className={styles.container}>
                <Form
                    layout='horizontal'
                    formValue={fdata}
                    onChange={setFdata}
                    onSubmit={saveChanges}
                >
                    <Form.Group controlId='photo'>
                        <Form.ControlLabel>Photo</Form.ControlLabel>
                        <Form.Control
                            accepter={Uploader}
                            name='photo'
                            fileListVisible={false}
                            listType='picture'
                            action=''
                            onUpload={handleProfilePicture}
                            accept='image/png, image/jpeg'
                        >
                            <div>
                                {uploading && <Loader backdrop center />}
                                {fdata.photo ? (
                                    <img
                                        src={fdata.photo[0].url}
                                        width='100%'
                                        height='100%'
                                    />
                                ) : (
                                    <ImageIcon />
                                )}
                            </div>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='displayName'>
                        <Form.ControlLabel>Full name</Form.ControlLabel>
                        <Form.Control
                            name='displayName'
                            placeholder='Dr. John Simpson'
                        />
                    </Form.Group>
                    <Form.Group controlId='role'>
                        <Form.ControlLabel>Role</Form.ControlLabel>
                        <Form.Control
                            name='role'
                            accepter={SelectPicker}
                            data={ROLES.map((role) => ({
                                label: role,
                                value: role,
                            }))}
                            placeholder='Select one...'
                            searchable={false}
                        />
                    </Form.Group>
                    <Form.Group controlId='domains'>
                        <Form.ControlLabel>Interests</Form.ControlLabel>
                        <Form.Control
                            name='domains'
                            placeholder='Domains'
                            accepter={TagPicker}
                            style={{ width: 300 }}
                            data={Object.keys(DOMAINS).map((key) => ({
                                label: key,
                                value: key,
                            }))}
                            searchable={true}
                            searchBy='value'
                        />
                    </Form.Group>
                    <Form.Group controlId='website'>
                        <Form.ControlLabel>Website</Form.ControlLabel>
                        <Form.Control
                            name='website'
                            placeholder='https://...'
                        />
                    </Form.Group>
                    <Form.Group controlId='address'>
                        <Form.ControlLabel>Address</Form.ControlLabel>
                        <Form.Control
                            name='address'
                            placeholder='Street, campus, room..'
                        />
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button appearance='primary' type='submit'>
                                Continue
                            </Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>
            </div>
        </>
    );
};

export default SetupTeacher;
