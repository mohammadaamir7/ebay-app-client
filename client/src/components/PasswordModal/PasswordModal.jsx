import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closePasswordModal, updatePasswordField, sendPasswordResetCode } from '../../features/profileSlice';

import './PasswordModal.css';

const Modal = () => {
    const dispatch = useDispatch();
    const { passwordModalOpen } = useSelector((state) => state.profile);

    if (!passwordModalOpen) {
        return null;
    }

    const handleCancel = () => {
        dispatch(closePasswordModal());
    };

    const handleInputChange = (event) => {
        dispatch(updatePasswordField({ value: event.target.value }));
    }

    return (
        <div className="password-modal-wrapper">
            <div className="password-modal-content">
                <div className="password-modal-content-text">
                    <h2>Forgot your password?</h2>
                    <span>We'll email you a code.</span>
                </div>
                <div className="password-reset-code-wrapper">
                    <input type="text"
                        className="password-reset-code-input"
                        placeholder="e.g 680948">
                    </input>
                </div>
                <div className="password-button-wrapper">
                    <button className="password-send-code-btn" onClick={() => dispatch(sendPasswordResetCode())}>
                        Send Code
                    </button>
                    <button className="password-continue-btn" onClick={null}>
                        Continue
                    </button>
                    <button className="password-cancel-btn" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
