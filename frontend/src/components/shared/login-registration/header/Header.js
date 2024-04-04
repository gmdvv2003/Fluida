import { ReactComponent as Logo } from "assets/icons/fluida-logo.svg";

import "./Header.css";

function Header() {
	return (
		<div className="H-header-container">
			<Logo className="H-header-logo" />
		</div>
	);
}

export default Header;
