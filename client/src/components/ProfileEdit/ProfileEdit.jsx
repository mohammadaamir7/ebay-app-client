import { useDispatch, useSelector } from 'react-redux';
import { updateField, openPasswordModal, updateUserProfile } from '../../features/profileSlice';
import './ProfileEdit.css';

import pfp from "./pfp.png";

const ProfileEdit = () => {
    const dispatch = useDispatch();
    const { profileData } = useSelector((state) => state.profile);

    const handleInputChange = (field, event) => {
        dispatch(updateField({ field, value: event.target.value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(updateUserProfile(profileData));
    }

    const handlePasswordModal = (event) => {
        event.preventDefault();
        dispatch(openPasswordModal());
    }

    return (
        <div>
            <div className="profile-edit-wrapper">
                <div className="profile-head">
                    <h3 className="profile-head-heading">Profile</h3>
                    <span className="profile-head-text">Update your photo and personal details here.</span>
                </div>
                <div className="profile-edit">
                    <span className="profile-edit-name">Username</span>
                    <input
                        type="text"
                        className="profile-input"
                        value={profileData.username}
                        onChange={(e) => handleInputChange('username', e)}
                    />
                </div>
                <div className="profile-edit">
                    <span className="profile-edit-name">First Name & Last Name</span>
                    <div className="profile-input-name-wrapper">
                        <input
                            type="text"
                            className="profile-input-name"
                            value={profileData.firstName}
                            onChange={(e) => handleInputChange('firstName', e)}
                        />
                        <input
                            type="text"
                            className="profile-input-name"
                            value={profileData.lastName}
                            onChange={(e) => handleInputChange('lastName', e)}
                        />
                    </div>
                </div>
                <div className="profile-edit">
                    <div className="profile-edit-name-wrapper">
                        <span className="profile-edit-name">Your Photo</span>
                        <span className="profile-edit-text">This will be displayed on your profile</span>
                    </div>
                    <div className="profile-edit-pfp-wrapper">
                        <img src={pfp} alt="profile" className="profile-edit-pfp" />
                        <div className="profile-edit-pfp-btn-wrapper">
                            <button className="profile-edit-pfp-delete">Delete</button>
                            <button className="profile-edit-pfp-update">Update</button>
                        </div>
                    </div>
                </div>
                <div className="profile-edit">
                    <span className="profile-edit-name">Forgot your password?</span>
                    <button className="profile-edit-password" onClick={handlePasswordModal}>Reset Password</button>
                </div>
                <div className="profile-edit">
                    <span className="profile-edit-name">Email</span>
                    <input
                        type="email"
                        className="profile-input"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e)}
                    />
                </div>
                <div className="profile-edit-function-wrapper">
                    <div className="profile-edit-function">
                        <button className="profile-edit-save" onClick={handleSubmit}>Save</button>
                        <button className="profile-edit-discard">Discard</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEdit;