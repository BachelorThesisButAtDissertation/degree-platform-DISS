import { useState } from 'react';
import {
    Button,
    ButtonToolbar,
    Form,
    Loader,
    TagPicker,
    Uploader,
} from 'rsuite';
import ImageIcon from '@rsuite/icons/Image';
import Textarea from '../basics/Textarea';

import styles from '../../styles/student/Setup.module.css';
import DOMAINS from '../../utils/domains.json';
import { getImageURL, uploadFileForUser } from '../../lib/storage/storageFunc';
import {
    createStudentInDB,
    saveStudentInDB,
    updateProfileData,
} from '../../lib/user/userFunc';

const SetupUser = ({ userId, endSetupMode }) => {
    const [fdata, setFdata] = useState({
        displayName: '',
        photo: null,
        interests: [],
        aboutMe: '',
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
                        url: url,
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
        await createStudentInDB(userId, {
            ...fdata,
            photo: fdata.photo?.[0].name,
            requests: 3,
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
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            height: 'auto',
                                            width: 'auto'
                                        }}
                                    />
                                ) : (
                                    <ImageIcon />
                                )}
                            </div>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='displayName'>
                        <Form.ControlLabel>Full name</Form.ControlLabel>
                        <Form.Control name='displayName' />
                    </Form.Group>
                    <Form.Group controlId='interests'>
                        <Form.ControlLabel>Interests</Form.ControlLabel>
                        <Form.Control
                            name='interests'
                            accepter={TagPicker}
                            style={{ width: 300 }}
                            data={Object.keys(DOMAINS).map((key) => ({
                                label: key,
                                value: key,
                            }))}
                            searchable={true}
                        />
                    </Form.Group>
                    <Form.Group controlId='aboutMe'>
                        <Form.ControlLabel>About me</Form.ControlLabel>
                        <Form.Control accepter={Textarea} name='aboutMe' />
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

export default SetupUser;
