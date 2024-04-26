import { Suspense } from "react";

import { ReactComponent as PlusIcon } from "assets/action-icons/add-circle-unlined.svg";
import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";

import TextInputField from "components/shared/text-input-field/TextInputField";
import LoadingDots from "components/shared/loading/LoadingDots";

import "./Phase.css";

function Phase({ cards, index, isLoading }) {
	return (
		<div className="PP-background">
			<Suspense fallback={<LoadingDots />}>
				{isLoading ? (
					<div className="PP-center-lock">
						<LoadingDots style={{ width: "32px", height: "32px" }} />
					</div>
				) : (
					<div>
						<div className="PP-header">
							<TextInputField
								name="title"
								placeholder={"Phase " + index}
								style={{ backgroundColor: "white", width: "100%", height: "100%" }}
							/>
							<PlusIcon className="PP-header-icon" />
							<DotsIcon className="PP-header-icon" />
						</div>

						<div className="PP-cards-container">{cards}</div>
					</div>
				)}
			</Suspense>
		</div>
	);
}

export default Phase;
