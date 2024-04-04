import "./InputFieldError.css";

function InputFieldError({ error }) {
	return (
		<div className="error-text-container">
			<a className="error-text">{error}</a>
		</div>
	);
}

export default InputFieldError;
