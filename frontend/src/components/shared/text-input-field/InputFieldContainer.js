import "./InputFieldContainer.css";

function InputFieldContainer({ description, grid_template_areas, children }) {
	return (
		<div className="IFC-input-field-container-holder">
			<div>
				<span className="IFC-input-field-description">{description}</span>
			</div>
			<div className="IFC-input-field-container" style={{ gridTemplateAreas: `"${grid_template_areas}"` }}>
				{children}
			</div>
		</div>
	);
}

export default InputFieldContainer;
