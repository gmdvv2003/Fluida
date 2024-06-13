import "./TextInputField.css";

import React, { useImperativeHandle, useRef, useState } from "react";

import ReactSubscriptionHelper from "utilities/react-subscription-helper/ReactSubscriptionHelper";

const TextInputField = React.forwardRef(
	({ name, placeholder, grid_area, container_style = {}, style = {}, type = "text", initial_text = null, is_text_area = false }, ref) => {
		const realRef = useRef(null);

		let [onTextChangeSubscriptionHelper] = useState(new ReactSubscriptionHelper());

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
				{!is_text_area ? (
					<input
						ref={realRef}
						className="TIF-text-input-field"
						name={name}
						type={type}
						value={initial_text}
						autoComplete={name}
						required
						placeholder={placeholder}
						style={style}
						onChange={handleOnTextChange}
					/>
				) : (
					<textarea
						ref={realRef}
						className="TIF-text-input-field"
						name={name}
						type={type}
						value={initial_text}
						autoComplete={name}
						required
						placeholder={placeholder}
						style={style}
						onChange={handleOnTextChange}
					/>
				)}
			</div>
		);
	}
);

export default TextInputField;
