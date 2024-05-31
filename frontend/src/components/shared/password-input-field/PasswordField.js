import "./PasswordField.css";

import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

import { ReactComponent as HidePasswordIcon } from "assets/action-icons/eye-open.svg";
import ReactSubscriptionHelper from "utilities/react-subscription-helper/ReactSubscriptionHelper";
import { ReactComponent as ShowPasswordIcon } from "assets/action-icons/eye-closed.svg";
import TextInputField from "components/shared/text-input-field/TextInputField";

const PasswordField = React.forwardRef(
	({ name, placeholder, leftComponent, middleComponent, rightComponent, textInputFieldStyle = {} }, ref) => {
		const [passwordVisibility, setPasswordVisibility] = useState(false);

		const passwordFieldReference = useRef(null);
		const currentPasswordFieldReferenceChangeListener = useRef(null);

		const [onPasswordChangeSubscriptionHelper] = useState(new ReactSubscriptionHelper());

		function togglePasswordVisibility() {
			setPasswordVisibility(!passwordVisibility);
		}

		function handleOnPasswordChange(event) {
			onPasswordChangeSubscriptionHelper.notify(event);
		}

		useImperativeHandle(ref, () => ({
			onPasswordChange: (subscriber) => {
				return onPasswordChangeSubscriptionHelper.subscribe(subscriber);
			},

			ref: passwordFieldReference,
		}));

		useEffect(() => {
			return passwordFieldReference.current.onTextChange(handleOnPasswordChange);
		});

		return (
			<div className="R-PF-password-input-field-container">
				{leftComponent && leftComponent}

				<TextInputField
					ref={passwordFieldReference}
					name="password"
					placeholder={placeholder}
					style={{
						...textInputFieldStyle,
						borderTopRightRadius: "0px",
						borderBottomRightRadius: "0px",
						borderRight: "0px",
					}}
					type={passwordVisibility ? "text" : "password"}
				/>

				{middleComponent && middleComponent}

				<div className="R-PF-toggle-password-button-container">
					<button type="button" className="R-PF-toggle-password-button" onClick={togglePasswordVisibility}>
						{passwordVisibility ? <HidePasswordIcon /> : <ShowPasswordIcon />}
					</button>
				</div>

				{rightComponent && rightComponent}
			</div>
		);
	}
);

export default PasswordField;
