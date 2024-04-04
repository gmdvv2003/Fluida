import "./InputFieldContainer.css";

function InputFieldContainer({ description, grid_template_areas, children }) {
	return (
		<div className="input-field-container-holder">
			<div>
				<span className="input-field-description">{description}</span>
			</div>
			<div
				className="input-field-container"
				style={{ gridTemplateAreas: `"${grid_template_areas}"` }}
			>
				{children}
			</div>
		</div>
	);
}

export default InputFieldContainer;
