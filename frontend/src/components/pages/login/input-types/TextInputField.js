import "./TextInputField.css";
function TextInputField({ name, placeholder, grid_area, style = {} }) {
	return (
		<div className="text-input-field-container" style={{ gridArea: grid_area }}>
			{" "}
			<input
				className="text-input-field"
				name={name}
				type="text"
				autoComplete={name}
				required
				placeholder={placeholder}
				style={style}
			/>{" "}
		</div>
	);
}
export default TextInputField;
