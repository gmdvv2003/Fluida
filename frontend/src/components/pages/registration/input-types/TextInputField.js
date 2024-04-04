import React, { useRef, useState, useImperativeHandle } from "react";

import "./TextInputField.css";

const TextInputField = React.forwardRef(({ name, placeholder, grid_area, style = {}, type = "text" }, ref) => {
	const realRef = useRef(null);

	const [onTextChangeSubscribers, setOnTextChangeSubscribers] = useState([]);

	function handleOnTextChange(event) {
		onTextChangeSubscribers.forEach((subscriber) => {
			subscriber(event);
		});
	}

	useImperativeHandle(ref, () => ({
		onTextChange: (subscriber) => {
			setOnTextChangeSubscribers([...onTextChangeSubscribers, subscriber]);
		},
		ref: realRef,
	}));

	return (
		<div className="text-input-field-container" style={{ gridArea: grid_area }}>
			<input
				ref={realRef}
				className="text-input-field"
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
