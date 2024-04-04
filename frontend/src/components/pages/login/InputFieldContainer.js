import "./InputFieldContainer.css";

function InputFieldContainer({ children }) {
	return (
		<div className="L-IFC-input-field-container">
			<div>{children}</div>
		</div>
	);
}

export default InputFieldContainer;
