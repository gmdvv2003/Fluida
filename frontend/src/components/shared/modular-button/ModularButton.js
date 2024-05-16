import "./ModularButton.css";

function ModularButton({ label, action, customClassName }) {
	return (
		<button onClick={action} className={`${customClassName}`}>
			{label}
		</button>
	);
}

export default ModularButton;
