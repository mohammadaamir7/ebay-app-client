import React, { useState } from 'react';
import './SignInForm.css';

const SignInForm = ( { onSignIn } ) => {
    const [SignInInfo, setSignInInfo] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setSignInInfo({
            ...SignInInfo,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <div className="sign-in-form-wrapper">
                <div className="sign-in-form sign-in-input-wrapper">
                    <h4 className="sign-in-form-heading">Welcome Back!</h4>
                    <input
                        name="email"
                        type="text"
                        placeholder="Enter Email"
                        required
                        value={SignInInfo.email}
                        onChange={handleChange}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        required
                        value={SignInInfo.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="sign-in-form sign-in-bth-wrapper">
                    <button className="sign-in-btn" onClick={() => onSignIn(SignInInfo)}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignInForm;
