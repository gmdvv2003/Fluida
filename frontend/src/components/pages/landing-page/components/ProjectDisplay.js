import "./ProjectDisplay.css";

import { useState } from "react";
/**
 *
 * [{path: "tela1.jpg", buttonName: "Tela de login"}, {path: "tela2.jpg", buttonName: "Tela de cadastro"}]
 */

function ProjectDisplay({ display }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	function handleButtonClick(frameIndex) {
		setCurrentImageIndex(frameIndex);
	}

	return (
		<div
			className="LP-fluida-project-display-container"
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				className="LP-image-display-container"
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					className="LP-image-display"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<img src={display[currentImageIndex].path} className="LP-project-display-1" />
				</div>
				<div className="LP-buttons-display-container" style={{ display: "flex" }}>
					{display.map(({ buttonName }, index) => {
						return (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									flexDirection: "column",
								}}
							>
								<button
									onClick={() => handleButtonClick(index)}
									className="LP-button-title-display"
								>
									{buttonName}
								</button>
								{index == currentImageIndex && (
									<div className="LP-button-selector" />
								)}
							</div>
						);
					})}
				</div>
			</div>
			<div className="LP-project-description-container">
				{display[currentImageIndex].description}
			</div>
		</div>
	);
}

export default ProjectDisplay;

//<img src="tela1.jpg" className="LP-project-display-1" />;
