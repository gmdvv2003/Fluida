import "./Popup.css";

import React, { useEffect } from "react";

function Popup({ message, onClose }) {
	useEffect(() => {
		const timeout = setTimeout(() => {
			onClose();
		}, 2000);

		return () => clearTimeout(timeout);
	}, [onClose]);

	return (
		<div className="popup-overlay">
			<div className="popup">
				<h2>Mensagem</h2>
				<p>{message}</p>
			</div>
		</div>
	);
}

export default Popup;
