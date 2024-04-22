import "./HeaderHome.css";

import { ReactComponent as Logo } from "assets/icons/fluida-logo.svg";

function HeaderHome() {
	return (
		<div className="HH-header-home-container">
			<div className="HH-container-logo">
				<Logo className="HH-header-home-logo" />
			</div>
			<div className="HH-input-buttons"> 
				<div className="HH-input-container">
					<input className="HH-input-search" type="text"></input>
					<i className="HH-icon-search"></i>
				</div>
				<div className="HH-buttons-container">
					<i className="HH-bell-icon"></i>
					<i className="HH-settings-icon"></i>
					<i className="HH-photo-icon"></i>
				</div>
			</div>
		</div>
	);
}

export default HeaderHome;
