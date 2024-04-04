import "./InputFieldError.css";

function InputFieldError({ error }) {
	return (
		<div className="E-error-text-container">
			<a className="E-error-text">{error}</a>
		</div>
	);
}

export default InputFieldError;
