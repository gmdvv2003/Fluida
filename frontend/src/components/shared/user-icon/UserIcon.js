import "./UserIcon.css";

function UserIcon({ userIcon64, scale = "64px" }) {
	return (
		<div className="UI-container" style={{ width: scale, height: scale }}>
			<img src={`data:image/jpeg;base64,${userIcon64}`} alt="User Icon" className="UI-icon" style={{ width: scale, height: scale }} />
		</div>
	);
}

export default UserIcon;
