import React, { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import TextInputField from "components/shared/text-input-field/TextInputField";

import "./PhaseConfiguration.css";

function PhaseConfigurations({ projectState, phase }) {
	const [enteredPhaseName, setEnteredPhaseName] = useState("");

	const phaseNameFieldReference = useRef(null);

	/**
	 *
	 */
	function handleUpdatePhaseButton() {
		projectState.current?.requestUpdatePhase(phase.phaseDTO.phaseId, enteredPhaseName).catch((error) => {
			console.error(`Erro ao atualizar fase:`, error);
		});
	}

	/**
	 *
	 */
	function handleDeletePhaseButton() {
		projectState.current?.requestDeletePhase(phase.phaseDTO.phaseId).catch((error) => {
			console.error(`Erro ao excluir fase:`, error);
		});
	}

	useEffect(() => {
		if (!phaseNameFieldReference.current) {
			return undefined;
		}

		return phaseNameFieldReference.current.onTextChange((event) => {
			setEnteredPhaseName(event.target.value);
		});
	});

	return (
		<div className="PP-dialog-overlay">
			<div className="PP-dialog-update-name-project-container">
				<div className="PP-container-label-update-project-name">
					<div className="PP-container-label-current-name-project">
						<div>Nome atual da fase:</div>
						<div className="PP-label-current-project-name">{phase?.phaseDTO?.phaseName}</div>
					</div>
					<div className="PP-container-close-dialog-project-update">
						<FontAwesomeIcon
							onClick={() => projectState.current.dismissPhaseConfigurationPreview()}
							icon={faCircleXmark}
							size="xl"
							style={{
								color: "#8c8c8c",
								cursor: "pointer",
								borderRadius: "50%",
							}}
						/>
					</div>
				</div>
				<div>
					<TextInputField
						style={{
							marginTop: "10px",
							marginBottom: "10px",
							borderRadius: "var(--border-radius)",
							backgroundColor: "rgb(244, 244, 244)",
						}}
						name="projectUpdate"
						placeholder="Novo nome da fase"
						ref={phaseNameFieldReference}
					/>
				</div>
				<div className="PP-container-buttons-update-project">
					<button
						className={`PP-button-update-project ${enteredPhaseName.length <= 0 ? "PP-button-update-project-disabled" : ""}`}
						disabled={enteredPhaseName.length <= 0}
						onClick={() => handleUpdatePhaseButton()}
					>
						Atualizar fase
					</button>
					<button className="PP-button-delete-project" onClick={() => handleDeletePhaseButton()}>
						Excluir fase
					</button>
				</div>
			</div>
		</div>
	);
}

export default PhaseConfigurations;
