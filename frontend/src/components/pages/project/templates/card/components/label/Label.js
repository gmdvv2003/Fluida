import "./Label.css";

function Label({ text, color }) {
	return (
		<div className="PCL-label-container" style={{ backgroundColor: color }}>
			<p className="PCL-label-text">{text}</p>
		</div>
	);
}

export default Label;
