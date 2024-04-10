import "./Header.css";

import { ReactComponent as Logo } from "assets/icons/fluida-logo.svg";

function Header() {
	return (
		<div className="H-header-container">
			<Logo className="H-header-logo" />
		</div>
	);
}

export default Header;
