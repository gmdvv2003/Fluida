// import { useState } from "react";

import "./LandingPage.css";
import Header from "components/shared/login-registration/header/Header";
// import TextInputField from "components/shared/text-input-field/TextInputField";
import ActionButton from "components/shared/action-button/ActionButton";
import Background from "components/shared/login-registration/background/Background";

// import LandingFish from "assets/icons/fluida-fish-landing-page.png";
// import LandingForm from "assets/icons/fluida-background-landing-page.png";
// import LandingWave from "assets/icons/fluida-background-landing-page-wave.png";
// import LandingIcon from "assets/icons/svgpag1.png";

function LandingPage() {
	return (
		<div>
			<Header />
			<div className="LP-background-page">
				<img
					src="fluida-background-landing-page.png"
					className="LP-fluida-background-waves"
				/>
				<div className="LP-fluida-description">
					<h1 className="LP-description-text-h1">
						Trabalhe em equipe e organize as tarefas
						<br />
						do seu projeto em um único lugar
					</h1>
					<a className="LP-description-text-a">
						Faça login ou cadastre-se agora mesmo. É grátis.
					</a>
					<div style={{ paddingTop: "10px" }}>
						<ActionButton
							title="Faça login"
							style={{
								width: "100px",
								height: "35px",
								fontSize: "15px",
								border: "2px solid #FFFFFF",
								BackgroundColor: "transparent",
							}}
							is_active={true}
						/>
					</div>
				</div>
				<div style={{ flexDirection: "column" }}>
					<div className="LP-fluida-icon-container">
						<img src="svgpag1.png" className="LP-fluida-icon" />
					</div>

					<div className="LP-fluida-icon-container">
						<a>teste</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LandingPage;
