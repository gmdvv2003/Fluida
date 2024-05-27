import "./HeaderConfigurations.css";
import { useEffect, useState } from "react";

import { useParams, useLocation, Navigate } from "react-router-dom";

function HeaderConfigurations() {
	const buttons = [
		{ name: "Perfil e Visibilidade", path: "account" },
		{ name: "Configurações", path: "general" },
	];

	let { pathname } = useLocation();
	pathname = pathname.split("/").reverse()[0];

	const [selectedButtonIndex, setSelectedButtonIndex] = useState(
		(() => {
			let selectedIndex = 0;

			buttons.forEach(({ path }, index) => {
				if (pathname == path) {
					selectedIndex = index;
				}
			});

			return selectedIndex;
		})()
	);

	return (
		<div className="C-header-configurations-container">
			{buttons.map(({ name, path }, index) => {
				return (
					<div
						className="AC-header-option-container"
						onClick={() => {
							setSelectedButtonIndex(index);
						}}
					>
						<a
							className={`C-button-text ${
								selectedButtonIndex == index && "C-button-text-selected"
							}`}
						>
							{name}
						</a>
						{selectedButtonIndex == index && <button className="C-button" />}
					</div>
				);
			})}
			{buttons[selectedButtonIndex].path != pathname && (
				<Navigate to={`/configurations/${buttons[selectedButtonIndex].path}`} />
			)}
		</div>
	);
}

export default HeaderConfigurations;
