import "./InputFieldContainer.css";

function InputFieldContainer({ description, grid_area, children }) {
	return (
		<div className="input-field-container">
			<div>
				<span>{description}</span>
			</div>
			<div>{children}</div>
		</div>
	);
}

export default InputFieldContainer;
