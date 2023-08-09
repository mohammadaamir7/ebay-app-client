import React, { useState } from 'react';
import './SignUpForm.css';

const SignUpForm = ({ onSignUp, errors, status }) => {
	const [signUpInfo, setSignUpInfo] = useState({
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const handleChange = (e) => {
		setSignUpInfo({
			...signUpInfo,
			[e.target.name]: e.target.value
		});
	};

	return (
		<div>
			<div className="sign-up-form-wrapper">
				<div className="sign-up-form sign-up-input-wrapper">
					<h4 className="sign-up-form-heading">Someone New!</h4>
					<div className="sign-up-input-names">
						<input
							name="firstName"
							type="text"
							placeholder="Enter First Name"
							autoFocus
							required
							value={signUpInfo.firstName}
							onChange={handleChange}
						/>
						<input
							name="lastName"
							type="text"
							placeholder="Enter Last Name"
							required
							value={signUpInfo.lastName}
							onChange={handleChange}
						/>
					</div>
					<input
						name="username"
						type="text"
						placeholder="Enter Username"
						required
						value={signUpInfo.username}
						onChange={handleChange}
					/>
					<input
						name="email"
						type="text"
						placeholder="Enter Email"
						required
						value={signUpInfo.email}
						onChange={handleChange}
					/>
					<input
						name="password"
						type="password"
						placeholder="Enter Password"
						required
						value={signUpInfo.password}
						onChange={handleChange}
					/>
					<input
						name="confirmPassword"
						type="password"
						placeholder="Enter Re-Type Password"
						required
						value={signUpInfo.confirmPassword}
						onChange={handleChange}
					/>
				</div>
				<div className="sign-up-form sign-up-bth-wrapper">
					<button className="sign-up-btn" onClick={() => onSignUp(signUpInfo)}>
						Sign Up
					</button>
					<div className="sign-up-form-msg">
						{errors[0] && (
							<span className="error">{ errors[0] } </span>
						)}
						{status && (
							<span className="status">{ status }</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUpForm;
