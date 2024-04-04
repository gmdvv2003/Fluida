import { ReactComponent as Logo } from "assets/icons/fluida-logo.svg";

import "./HeaderHome.css";

function HeaderHome() {
	return (
		<div className="HM-header-home-container">
			<div className="HM-container-logo">
				<Logo className="HM-header-logo" />
			</div>
			<div className="HM-input-container">
				<input className="HM-input-search" type="text"></input>
				<i className="HM-icon-search"></i>
			</div>
			<div className="HM-buttons-container">
				<i className="HM-bell-icon"></i>
				<i className="HM-settins-icon"></i>
				<i className="HM-photo-icon"></i>
			</div>
		</div>
	);
}

export default HeaderHome;
