import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import "./CommonPopup.css";

function CommonPopup({ dismissPopup }, { uuid, severity, message }) {
	function dismissThisPopup() {
		dismissPopup(uuid);
	}

	return (
		<div className={`SPC-C-container SPC-C-container-${severity}`}>
			<FontAwesomeIcon
				icon={(() => {
					switch (severity) {
						case "success":
							return faCircleCheck;

						case "info":
							return faCircleInfo;

						case "warning":
							return faTriangleExclamation;

						case "error":
							return faCircleExclamation;

						default:
							break;
					}
				})()}
				className="SPC-C-icon"
			/>

			<div className="SPC-C-message">{message}</div>

			<FontAwesomeIcon icon={faXmark} className="SPC-C-close" onClick={dismissThisPopup} />
		</div>
	);
}

export { CommonPopup };
