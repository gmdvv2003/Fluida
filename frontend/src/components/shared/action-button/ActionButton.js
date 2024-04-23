import "./ActionButton.css";

function ActionButton({ title, is_active, on_click }) {
	return (
		<button
			onClick={on_click}
			type="button"
			className={`L-start-session-button ${is_active ? "active" : ""}`}
		>
			{title}
		</button>
	);
}

export default ActionButton;
