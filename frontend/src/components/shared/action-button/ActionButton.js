import "./ActionButton.css";

function ActionButton({ title, is_active, on_click, style = {} }) {
	return (
		<button
			onClick={on_click}
			type="button"
			style={style}
			className={`ACB-start-session-button ${is_active ? "ACB-action-button-active" : ""}`}
		>
			{title}
		</button>
	);
}

export default ActionButton;
