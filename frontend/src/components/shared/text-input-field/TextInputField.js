import "./TextInputField.css";

import React, { useImperativeHandle, useRef } from "react";

import ReactSubscriptionHelper from "utilities/react-subscription-helper/ReactSubscriptionHelper";

const TextInputField = React.forwardRef(({ name, placeholder, grid_area, container_style = {}, style = {}, type = "text" }, ref) => {
	const realRef = useRef(null);

	const onTextChangeSubscriptionHelper = new ReactSubscriptionHelper();

	function handleOnTextChange(event) {
		onTextChangeSubscriptionHelper.notify(event);
	}

	useImperativeHandle(ref, () => ({
		onTextChange: (subscriber) => {
			return onTextChangeSubscriptionHelper.subscribe(subscriber);
		},
		ref: realRef,
	}));

	container_style.gridArea = grid_area;

	return (
		<div className="TIF-text-input-field-container" style={container_style}>
			<input
				ref={realRef}
				className="TIF-text-input-field"
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
});

export default TextInputField;
