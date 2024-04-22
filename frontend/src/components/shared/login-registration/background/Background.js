import "./Background.css";
import { ReactComponent as IdentityFish } from "assets/icons/fluida-identity-fish.svg";

function Background() {
	return (
		<div className="BG-fluida-background-container">
			<img src="fluida-background-wave.png" className="BG-fluida-background-waves" />
			<IdentityFish className="BG-fluida-identity-fish" />
		</div>
	);
}

export default Background;
