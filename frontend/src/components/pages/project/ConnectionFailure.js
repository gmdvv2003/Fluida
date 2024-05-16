import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

import "./ConnectionFailure.css";

function ConnectionFailure({ connectionFailure, errorCode }) {
	return (
		<div className={`PCF-background ${connectionFailure ? "PCF-alert-in" : "PCF-alert-out"}`}>
			<div className="PCF-container">
				<a className="PCF-error-title">Não foi possível conectar ao servidor... (14)</a>
				<a className="PCF-error-description">Erro: 500</a>
				<FontAwesomeIcon className="PCF-error-icon" icon={faTriangleExclamation} style={{ color: "#ffffff" }} />
			</div>
		</div>
	);
}

export default ConnectionFailure;
