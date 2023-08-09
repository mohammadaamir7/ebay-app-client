import React, { useState } from "react";

import SignUpForm from '../../components/SignUpForm/SignUpForm';

import "./SignUp.css";

const SignUp = ({ config }) => {
	const [errors, setErrors] = useState([]);
	const [status, setStatus] = useState('');

    const handleSignUp = async (signUpInfo) => {
		try {
			setStatus('Pending...')

            const response = await fetch(`${config.DOMAIN}${config.API_PREFIX}/account/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpInfo)
            });
            
			const responseData = await response.json();
			
			if (!response.ok) {
				if (responseData.errors) setErrors(responseData.errors.map(error => error.msg));
				setStatus('Unsuccessful')
				console.error('Network response was not ok');
			}

			setStatus('Successful')
			            
        } catch (error) {
			console.error('There was a problem with the fetch operation: ', error);
			setStatus('Unsuccessful')
        }
    }

    return (
        <div className="sign-up-wrapper">
            <SignUpForm onSignUp={handleSignUp} errors={errors} status={status} />
        </div>
    );
};  

export default SignUp;
