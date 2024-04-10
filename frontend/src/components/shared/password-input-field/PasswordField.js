import "./PasswordField.css";

import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

import { ReactComponent as HidePasswordIcon } from "assets/action-icons/eye-open.svg";
import ReactSubscriptionHelper from "utilities/react-subscription-helper/ReactSubscriptionHelper";
import { ReactComponent as ShowPasswordIcon } from "assets/action-icons/eye-closed.svg";
import TextInputField from "components/shared/text-input-field/TextInputField";

const PasswordField = React.forwardRef(({ name, placeholder }, ref) => {
	const passwordFieldReference = useRef(null);

	const [passwordVisibility, setPasswordVisibility] = useState(false);

	const onPasswordChangeSubscriptionHelper = new ReactSubscriptionHelper();

	function togglePasswordVisibility() {
		setPasswordVisibility(!passwordVisibility);
	}

	function handleOnPasswordChange(event) {
		onPasswordChangeSubscriptionHelper.getSubscriptions().forEach((subscription) => {
			subscription.notify(event);
		});
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
				<button type="button" className="R-PF-toggle-password-button" onClick={togglePasswordVisibility}>
					{passwordVisibility ? <ShowPasswordIcon /> : <HidePasswordIcon />}
				</button>
			</div>
		</div>
	);
});

export default PasswordField;
