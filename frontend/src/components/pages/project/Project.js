import { useState } from "react";

import HomeHeader from "../../shared/login-registration/header-home/HeaderHome";

import Phase from "./templates/phase/Phase";
import Card from "./templates/card/Card";

import "./Project.css";

function Project() {
	return (
		<div>
			<HomeHeader />
			<div className="P-background">
				<div className="P-phases-container-holder">
					<div className="P-phases-container">
						<Phase cards={[<Card />]} />
						<Phase cards={[<Card />]} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Project;
