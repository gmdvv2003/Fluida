import "./InputFieldContainer.css";

function InputFieldContainer({ children }) {
	return (
		<div className="input-field-container">
			<div>{children}</div>
		</div>
	);
}

export default InputFieldContainer;
