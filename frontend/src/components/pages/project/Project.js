import { ReactComponent as AddButtonIcon } from "assets/action-icons/add-circle-unlined.svg";

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
						<Phase cards={[<Card />, <Card />]} />
					</div>

					<div className="P-add-new-phase-button-container">
						<button className="P-add-new-phase-button">
							<AddButtonIcon className="P-add-new-phase-button-icon" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Project;
