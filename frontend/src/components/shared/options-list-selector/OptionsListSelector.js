import "./OptionsListSelector.css";

function OptionsListSelector({ name, options, container_style, style }) {
	return (
		<div className="options-list-selector-container" style={container_style}>
			<select className="options-list-selector" style={style} name={name}>
				{options.map((option) => (
					<option value={option}>{option}</option>
				))}
			</select>
		</div>
	);
}

export default OptionsListSelector;
