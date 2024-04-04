import React, { useRef, useState, useEffect, useImperativeHandle } from "react";

import { ReactComponent as ShowPasswordIcon } from "assets/action-icons/eye-closed.svg";
import { ReactComponent as HidePasswordIcon } from "assets/action-icons/eye-open.svg";

import TextInputField from "./../TextInputField";

import "./PasswordField.css";

const PasswordField = React.forwardRef(({ name, placeholder }, ref) => {
	const [onPasswordChangeSubscribers, setOnPasswordChangeSubscribers] = useState([]);
	const [visible, setVisible] = useState(false);

	const passwordFieldReference = useRef(null);

	function togglePasswordVisibility() {
		setVisible(!visible);
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
	})

	return (
		<div className="password-input-field-container">
			<TextInputField
				ref={passwordFieldReference}
				name="password"
				placeholder={placeholder}
				style={{
					borderTopRightRadius: "0px",
					borderBottomRightRadius: "0px",
					borderRight: "0px",
				}}
				type={!visible ? "text" : "password"}
			/>

			<div className="toggle-password-button-container">
				<button
					type="button"
					className="toggle-password-button"
					onClick={togglePasswordVisibility}
				>
					{visible ? <ShowPasswordIcon /> : <HidePasswordIcon />}
				</button>
			</div>
		</div>
	);
});

export default PasswordField;
