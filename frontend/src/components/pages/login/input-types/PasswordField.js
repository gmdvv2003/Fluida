import "./PasswordField.css";
import "./../Login.css";

import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

import { ReactComponent as ClosedEyeIcon } from "assets/action-icons/eye-closed.svg";
import { ReactComponent as OpenEyeIcon } from "assets/action-icons/eye-open.svg";
import { ReactComponent as PadlockIcon } from "assets/action-icons/padlock.svg";
import ReactSubscriptionHelper from "utilities/react-subscription-helper/ReactSubscriptionHelper";
import TextInputField from "components/shared/text-input-field/TextInputField";

const PasswordField = React.forwardRef(({}, ref) => {
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
		<div className="L-left-password-icon-container">
			<div className="L-left-icon-container">
				<PadlockIcon className="L-left-icon" />
			</div>
			<TextInputField
				ref={passwordFieldReference}
				style={{
					borderTopLeftRadius: "0px",
					borderBottomLeftRadius: "0px",
					borderTopRightRadius: "0px",
					borderBottomRightRadius: "0px",
					borderLeft: "none",
					borderRight: "none",
				}}
				placeholder="senha"
				type={passwordVisibility ? "text" : "password"}
			/>
			<div className="L-reveal-password-icon-container">
				<button type="button" className="L-PF-toggle-password-button" onClick={togglePasswordVisibility}>
					{(passwordVisibility && <OpenEyeIcon className="L-reveal-password-icon" />) || (
						<ClosedEyeIcon className="L-reveal-password-icon" />
					)}
				</button>
			</div>
		</div>
	);
});

export default PasswordField;
