import React from "react";

import ProfileEdit from '../../components/ProfileEdit/ProfileEdit';
import PasswordModal from '../../components/PasswordModal/PasswordModal';

import "./Profile.css";

const SignIn = ({ config }) => {
    return (
        <div className="profile-wrapper">
            <PasswordModal />
            <ProfileEdit />
        </div>
    );
};

export default SignIn;
