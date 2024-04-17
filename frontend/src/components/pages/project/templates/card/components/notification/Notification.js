import "./Notification.css";

function Notification({ Icon, text }) {
	return (
		<div className="PCN-container">
			<Icon className="PCN-icon" />
			<p className="PCN-text">{text}</p>
		</div>
	);
}

export default Notification;
