import React from "react";

import SignInForm from '../../components/SignInForm/SignInForm.jsx';

import "./SignIn.css";

const SignIn = ({ config }) => {
    const handleSignIn = async (SignInInfo) => {
        try {
            const response = await fetch(`${config.DOMAIN}${config.API_PREFIX}/account/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(SignInInfo)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            localStorage.setItem('token', responseData.token);
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        }
    }

    return (
        <div className="sign-in-wrapper">
            <SignInForm onSignIn={handleSignIn} />
        </div>
    );
};

export default SignIn;
