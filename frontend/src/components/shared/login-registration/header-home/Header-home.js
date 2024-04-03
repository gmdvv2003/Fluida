import { ReactComponent as Logo } from "assets/icons/fluida-logo.svg";

import "./Header.css";

function Header() {
	return (
		<div className="header-container">
			<Logo className="header-logo" />
		</div>
	);
}

export default Header;
