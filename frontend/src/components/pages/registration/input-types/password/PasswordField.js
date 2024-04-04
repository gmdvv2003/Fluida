import React, { useRef, useState, useEffect, useImperativeHandle } from "react";

import { ReactComponent as ShowPasswordIcon } from "assets/action-icons/eye-closed.svg";
import { ReactComponent as HidePasswordIcon } from "assets/action-icons/eye-open.svg";

import TextInputField from "./../TextInputField";

import "./PasswordField.css";

const PasswordField = React.forwardRef(({ name, placeholder }, ref) => {
	const passwordFieldReference = useRef(null);

	const [onPasswordChangeSubscribers, setOnPasswordChangeSubscribers] = useState([]);
	const [passwordVisibility, setPasswordVisibility] = useState(false);

	function togglePasswordVisibility() {
		setPasswordVisibility(!passwordVisibility);
	}

	function handleOnPasswordChange(event) {
		onPasswordChangeSubscribers.forEach((subscriber) => {
			subscriber(event);
		});
	}

	useImperativeHandle(ref, () => ({
		onPasswordChange: (subscriber) => {
			setOnPasswordChangeSubscribers([...onPasswordChangeSubscribers, subscriber]);
		},

		ref: passwordFieldReference,
	}));

	useEffect(() => {
		passwordFieldReference.current.onTextChange(handleOnPasswordChange);
	});

	return (
		<div className="R-PF-password-input-field-container">
			<TextInputField
				ref={passwordFieldReference}
				name="password"
				placeholder={placeholder}
				style={{
					borderTopRightRadius: "0px",
					borderBottomRightRadius: "0px",
					borderRight: "0px",
				}}
				type={!passwordVisibility ? "text" : "password"}
			/>

			<div className="R-PF-toggle-password-button-container">
				<button
					type="button"
					className="R-PF-toggle-password-button"
					onClick={togglePasswordVisibility}
				>
					{passwordVisibility ? <ShowPasswordIcon /> : <HidePasswordIcon />}
				</button>
			</div>
		</div>
	);
});

export default PasswordField;
