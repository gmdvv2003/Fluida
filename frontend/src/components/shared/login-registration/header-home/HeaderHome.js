import { ReactComponent as Logo } from "assets/icons/fluida-logo.svg";

import "./HeaderHome.css";

function HeaderHome() {
	return (
		<div className="header-home-container">
			<div className="container-logo">
				<Logo className="header-logo" />
			</div>
			<div className="input-container">
				<input className="input-search" type="text"></input>
				<i className="icon-search"></i>
			</div>
			<div className="buttons-container">
				<i className="bell-icon"></i>
				<i className="settins-icon"></i>
				<i className="photo-icon"></i>
			</div>
		</div>
	);
}

export default HeaderHome;
