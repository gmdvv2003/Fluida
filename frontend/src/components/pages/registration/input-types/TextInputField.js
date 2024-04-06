import React, { useRef, useImperativeHandle } from "react";

import ReactSubscriptionHelper from "utilities/react-subscription-helper/ReactSubscriptionHelper";

import "./TextInputField.css";

const TextInputField = React.forwardRef(
	({ name, placeholder, grid_area, container_style = {}, style = {}, type = "text" }, ref) => {
		const realRef = useRef(null);

		const onTextChangeSubscriptionHelper = new ReactSubscriptionHelper();

		function handleOnTextChange(event) {
			onTextChangeSubscriptionHelper.getSubscriptions().forEach((subscriber) => {
				subscriber.notify(event);
			});
		}

		useImperativeHandle(ref, () => ({
			onTextChange: (subscriber) => {
				return onTextChangeSubscriptionHelper.subscribe(subscriber);
			},
			ref: realRef,
		}));

		container_style.gridArea = grid_area;

		return (
			<div className="R-TIF-text-input-field-container" style={container_style}>
				<input
					ref={realRef}
					className="R-TIF-text-input-field"
					name={name}
					type={type}
					autoComplete={name}
					required
					placeholder={placeholder}
					style={style}
					onChange={handleOnTextChange}
				/>
			</div>
		);
	}
);

export default TextInputField;
