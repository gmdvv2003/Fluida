import "./ActionButton.css";

function ActionButton({ title, is_active, on_click }) {
	return (
		<button
			onClick={on_click}
			type="button"
			className={`ACB-start-session-button ${is_active ? "ACB-action-button-active" : ""}`}
		>
			{title}
		</button>
	);
}

export default ActionButton;
