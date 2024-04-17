import { ReactComponent as PlusIcon } from "assets/action-icons/add-circle-unlined.svg";
import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";

import TextInputField from "components/shared/text-input-field/TextInputField";

import "./Phase.css";

function Phase({ cards }) {
	return (
		<div className="PP-background">
			<div className="PP-header">
				<TextInputField
					name="title"
					placeholder="Nome da Fase"
					style={{ backgroundColor: "white", width: "100%", height: "100%" }}
				/>
				<PlusIcon className="PP-header-icon" />
				<DotsIcon className="PP-header-icon" />
			</div>

			<div className="PP-cards-container">{cards}</div>
		</div>
	);
}

export default Phase;
