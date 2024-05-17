import "./Footer.css";

import { ReactComponent as Logo } from "assets/icons/fluida-logo.svg";

function Footer() {
	return (
		<div className="F-footer-container">
			<Logo className="F-footer-logo" />
			<a className="F-footer-copyright">Copyright © 2024 Fluida</a>
		</div>
	);
}

export default Footer;
