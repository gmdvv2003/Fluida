import "./EditCard.css";

import React, { useEffect, useRef, useState } from "react";

import ModularButton from "components/shared/modular-button/ModularButton";
import TextInputField from "components/shared/text-input-field/TextInputField";
import UserIcon from "components/shared/user-icon/UserIcon";

function EditCard({ projectState, card }) {
	const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
	const [isLabelsDialogOpen, setIsLabelsDialogOpen] = useState(false);
	const [isDueDateDialogOpen, setIsDueDateDialogOpen] = useState(false);
	const [isMoveCardDialogOpen, setIsMoveCardDialogOpen] = useState(false);

	const [cardTitle, setCardTitle] = useState(null);
	const [cardDescription, setCardDescription] = useState(null);

	const [thisCardPhaseState, setThisCardPhaseState] = useState(card.phase);

	const cardTitleFieldReference = useRef(null);
	const cardDescriptionFieldReference = useRef(null);

	function handleOnCardTitleChange(event) {
		setCardTitle(event.target.value);
	}

	function handleOnCardDescriptionChange(event) {
		setCardDescription(event.target.value);
	}

	useEffect(() => {
		const phaseState = projectState.current?.getPhaseState(card?.cardDTO?.phaseId);
		setThisCardPhaseState(phaseState);

		const unbindTitleChangeSubscription = cardTitleFieldReference.current.onTextChange(handleOnCardTitleChange);
		const unbindEmailChangeSubscription = cardDescriptionFieldReference.current.onTextChange(handleOnCardDescriptionChange);

		return () => {
			unbindTitleChangeSubscription();
			unbindEmailChangeSubscription();
		};
	}, []);

	return (
		<div className="EC-container">
			<div className="EC-container-externo">
				<div className="EC-container-card">
					<div className="EC-container-header">
						<div className="EC-header-card">CARD #{card?.cardDTO.cardId}</div>
						<div className="EC-header-phase">
							<div className="EC-header-phase-label">Fase </div>
							<div className="EC-header-phase-phase">{thisCardPhaseState?.phaseName}</div>
						</div>
					</div>
					<div className="EC-container-interno-card">
						<div className="EC-container-interno-card-esquerda">
							<TextInputField
								placeholder={card?.cardDTO?.cardName}
								container_style={{ marginBottom: "8px", height: "35px" }}
								style={{
									backgroundColor: "rgb(244, 244, 244)",
									color: "black",
									fontWeight: "bold",
									fontSize: "large",
									height: "35px",
								}}
								ref={cardTitleFieldReference}
							/>
							<div className="EC-container-descricao">
								<div className="EC-label-descricao">Descrição</div>
								<TextInputField
									placeholder={card?.cardDTO?.cardDescription}
									container_style={{ marginBottom: "8px" }}
									style={{
										backgroundColor: "rgb(244, 244, 244)",
										color: "black",
										fontWeight: "bold",
										fontSize: "large",
										rows: "8",
										resize: "none",
										height: "150px",
									}}
									is_text_area={true}
									ref={cardDescriptionFieldReference}
								/>
							</div>
							<div className="EC-container-anexo">
								<div className="EC-label-anexo">Anexo</div>
								<div className="EC-container-files">
									<input type="file" id="fileUpload" style={{ display: "none" }} multiple />
									<ModularButton label="+ adicionar novo arquivo" customClassName={"EC-botao-anexo"} />
									<div>
										<div className="EC-label-anexo">Nenhum arquivo anexado!</div>
									</div>
								</div>
							</div>
							<div className="EC-container-data">
								<div className="EC-label-data">Data</div>
								<div className="EC-data">
									<div className="EC-dateday">10/03/2024</div>
									<div>00:00</div>
								</div>
							</div>
							<div className="EC-container-comentarios">
								<div className="EC-label-comentarios">Comentários</div>
							</div>
						</div>
						<div className="EC-container-interno-card-direita">
							<div className="EC-container-members">
								<div className="EC-div-input-members"></div>
							</div>
							<div className="EC-container-actions">
								<div className="EC-label-action">Ações</div>
								<div className="EC-container-buttons-actions">
									<div className="EC-actions-buttons">
										<ModularButton label="Membros" customClassName={"EC-button"} action={() => setIsMembersDialogOpen(!isMembersDialogOpen)} />
										<ModularButton label="Etiquetas" customClassName={"EC-button"} />
										<ModularButton label="Data" customClassName={"EC-button"} />
										<ModularButton label="Mover" customClassName={"EC-button"} />
										<ModularButton
											label="Excluir este card"
											customClassName={"EC-button"}
											action={() => {
												projectState.current?.requestDeleteCard(card?.cardDTO?.cardId)?.catch((error) => {
													console.error(`Erro ao excluir o card:`, error);
												});
											}}
										/>
										{(cardTitle || cardDescription) && (
											<ModularButton
												label="Atualizar card"
												customClassName={"EC-button-update"}
												action={() => {
													projectState.current?.requestUpdateCard(card?.cardDTO?.cardId, cardTitle, cardDescription)?.catch((error) => {
														console.error(`Erro ao atualizar o card:`, error);
													});
												}}
											/>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="EC-dialog">
				{isMembersDialogOpen && (
					<div className="EC-dialog-members-container">
						<div className="EC-container-header-dialog">
							<div className="EC-label-members">Membros</div>
							<div className="EC-label-members-button">
								<ModularButton label="X" customClassName={"EC-button-remover"} action={() => setIsMembersDialogOpen(!isMembersDialogOpen)} />
							</div>
						</div>
						<div className="EC-container-icons-members">
							<div className="EC-input-search-members">
								<input className="EC-input-members"></input>
							</div>
							<div className="EC-members">
								<div className="EC-member"></div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default EditCard;
