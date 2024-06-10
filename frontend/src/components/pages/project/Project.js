import "./Project.css";

import { useRef, useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { ReactComponent as AddButtonIcon } from "assets/action-icons/add-circle-unlined.svg";

import { useProjectAuthentication } from "context/ProjectAuthenticationContext";
import { useSystemPopups } from "context/popup/SystemPopupsContext";

import HomeHeader from "components/shared/login-registration/header-home/HeaderHome";

import EditCard from "./edit-card/EditCard";
import ProjectUsers from "./project-users/ProjectUsers";

import LazyLoader from "utilities/lazy-loader/LazyLoader";
import DragableModalDropLocationWithLazyLoader from "utilities/dragable-modal/drop-location/DragableModalDropLocationWithLazyLoader";
import ReactSubscriptionHelper from "utilities/react-subscription-helper/ReactSubscriptionHelper";

import Phase from "./templates/phase/Phase";
import ConnectionFailure from "./ConnectionFailure";

import Backdrop from "components/shared/backdrop/Backdrop";

class CardState {
	cardDTO;

	constructor(cardDTO) {
		this.cardDTO = cardDTO;
	}
}

class PhaseState {
	phaseDTO;

	cards = [];
	cardsMap = {};

	totalCards = 0;

	constructor(phaseDTO) {
		this.phaseDTO = phaseDTO;
	}
}

class ProjectState {
	#socket;

	members = [];

	phases = [];
	phasesMap = {};

	totalPhases = 0;

	// Indica se o número total de fases foi sincronizado com o servidor
	totalPhasesSynced = false;

	#projectMembersStateListeners = new ReactSubscriptionHelper();
	#projectPhasesStateListeners = new ReactSubscriptionHelper();

	// Cada fase tem um listener
	#projectCardsStateListeners = [];

	constructor(socket) {
		new Promise((resolve, reject) => {
			async function fetchProjectMembers(page = 1) {
				socket.emit("fetchProjectMembers", { page }, (response) => {
					const members = response?.members?.taken;
					if (!members) {
						return reject();
					}

					members.forEach((member) => {
						this.members.push(member);
					});

					if (response?.members?.hasNextPage) {
						fetchProjectMembers(page + 1);
					} else {
						resolve();
					}

					this.#projectPhasesStateListeners.notify({ members });
				});
			}

			fetchProjectMembers();
		})
			.then(() => {})
			.catch(() => {});

		this.#socket = socket;
	}

	/**
	 * Inscreve um callback para ser chamado quando o estado dos membros do projeto mudar.
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	onProjectMembersStateChange(callback) {
		return this.#projectMembersStateListeners.subscribe(callback);
	}

	/**
	 * Inscreve um callback para ser chamado quando o estado das fases do projeto mudar.
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	onProjectPhasesStateChange(callback) {
		return this.#projectPhasesStateListeners.subscribe(callback);
	}

	/**
	 * Inscreve um callback para ser chamado quando o estado dos cards do projeto mudar.
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	onProjectCardsStateChange(callback, phaseId) {
		return this.#projectCardsStateListeners.subscribe(callback);
	}

	getMembers() {
		return this.members;
	}

	/**
	 * Retorna o número total de fases.
	 *
	 * @param {boolean} sync
	 * @returns {Promise}
	 */
	async getTotalPhases(sync = false) {
		return new Promise((resolve) => {
			// Caso sync = true ou o número total de fases ainda não tenha sido sincronizado, então é feito um fetch do número total de fases
			// Caso contrário, é retornado o número total de fases local
			if (!this.totalPhasesSynced && !sync) {
				return this.#socket.emit("getTotalPhases", null, (response) => {
					let retrievedCount = response?.amount;

					// Se o número total de fases foi retornado, então o número total de fases foi sincronizado
					if (retrievedCount != undefined) {
						this.totalPhases = retrievedCount;
						this.totalPhasesSynced = true;
					}

					resolve(this.totalPhases);
				});
			}

			return resolve(this.totalPhases);
		});
	}

	/**
	 *
	 * @param {number} phaseId
	 * @param {boolean} sync
	 * @returns
	 */
	async getTotalCards(phaseId, sync = false) {
		return 0;
	}

	/**
	 * Pega o estado de uma fase.
	 *
	 * @param {number} phaseId
	 * @returns {PhaseState}
	 */
	getPhaseState(phaseId) {
		return this.phasesMap[phaseId];
	}

	/**
	 * Pega o estado de um card.
	 *
	 * @param {number} phaseId
	 * @param {number} cardId
	 * @returns {CardState}
	 */
	getCardState(phaseId, cardId) {
		return this.getPhaseState(phaseId)?.cardsMap[cardId];
	}

	/**
	 * Retorna as fases do projeto.
	 *
	 * @returns {Array}
	 */
	getPhases() {
		return this.phases;
	}

	/**
	 * Retorna os cards de uma fase.
	 *
	 * @param {number} phaseId
	 * @returns {Array}
	 */
	getCards(phaseId) {
		return this.getPhaseState(phaseId)?.cards;
	}

	/**
	 * Resposta do servidor para a criação de uma fase.
	 *
	 * @param {Object} phaseDTO
	 * @returns {PhaseState}
	 */
	phaseCreated(phaseDTO, fromFetch = false, fromLazyLoader = false) {
		phaseDTO = phaseDTO?.[0];
		if (!phaseDTO) {
			return null;
		}

		if (this.getPhaseState(phaseDTO.phaseId)) {
			return null;
		}

		// Criar o estado da fase
		const phaseState = new PhaseState(phaseDTO);

		// Adiciona a fase ao estado da fase
		if (!fromLazyLoader) {
			this.phases.push(phaseState);
		}

		this.phasesMap[phaseDTO.phaseId] = phaseState;

		this.totalPhases += fromFetch ? 0 : 1;

		// Atualizar o estado do projeto
		this.#projectPhasesStateListeners.notify(phaseDTO);

		return phaseState;
	}

	/**
	 * Resposta do servidor para a atualização de uma fase.
	 *
	 * @param {number} phaseId
	 * @param {Object} updatedPhaseDTOFields
	 */
	phaseUpdated(phaseId, updatedPhaseDTOFields) {}

	/**
	 * Resposta do servidor para a remoção de uma fase.
	 *
	 * @param {number} phaseId
	 */
	phaseDeleted(phaseId) {}

	/**
	 * Resposta do servidor para a movimentação de uma fase.
	 *
	 * @param {number} phaseId
	 * @param {number} targetPositionIndex
	 */
	phaseMoved(phaseId, targetPositionIndex) {}

	/**
	 * Resposta do servidor para a criação de um card.
	 *
	 * @param {Object} cardDTO
	 * @returns {CardState}
	 */
	cardCreated(cardDTO, fromFetch = false, fromLazyLoader = false) {
		cardDTO = cardDTO?.[0];
		if (!cardDTO) {
			return null;
		}

		const phaseState = this.getPhaseState(cardDTO.phaseId);
		if (!phaseState) {
			return null;
		}

		if (this.getCardState(cardDTO.phaseId, cardDTO.cardId)) {
			return null;
		}

		// Criar o estado do card
		const cardState = new CardState(cardDTO);

		// Adiciona o card ao estado da fase
		if (!fromLazyLoader) {
			phaseState.cards?.push(cardState);
		}

		phaseState.cardsMap[cardDTO.cardId] = cardState;

		// Incrimenta o número total de cards
		phaseState.totalCards += fromFetch ? 0 : 1;

		// Atualizar o estado do projeto
		this.#projectCardsStateListeners.notify(cardDTO);

		return cardState;
	}

	/**
	 * Resposta do servidor para a atualização de um card.
	 *
	 * @param {number} cardId
	 * @param {Object} updatedCardDTOFields
	 */
	cardUpdated(cardId, updatedCardDTOFields) {}

	/**
	 * Resposta do servidor para a remoção de um card.
	 *
	 * @param {number} cardId
	 */
	cardDeleted(cardId) {}

	/**
	 * Resposta do servidor para a movimentação de um card.
	 *
	 * @param {number} cardId
	 * @param {number} targetPhaseIndex
	 * @param {number} targetPositionIndex
	 */
	cardMoved(cardId, targetPhaseIndex, targetPositionIndex) {}

	/**
	 * Resposta do servidor para o fetch das fases.
	 *
	 * @param {Array} phases
	 */
	phasesFetched(phases) {
		phases = phases?.[0]?.taken?.filter(({ phaseId }) => this.phasesMap[phaseId] == undefined);
		phases.forEach((phase) => {
			// Cria o estado da fase
			this.phaseCreated([phase], true);

			// Realiza o fetch dos cards da fase inicial
			this.#socket.emit("fetchCards", { page: 0, phaseId: phase?.phaseId });
		});
	}

	/**
	 * Resposta do servidor para o fetch dos cards.
	 *
	 * @param {number} phaseId
	 * @param {Array} cards
	 */
	cardsFetched(phaseId, cards) {
		cards?.taken?.forEach((card) => {
			// Cria o estado do card
			this.cardCreated([card], true);
		});
	}

	/**
	 *
	 * @param {*} phaseDTO
	 * @returns
	 */
	newPhaseState(phaseDTO) {
		return new PhaseState(phaseDTO);
	}

	/**
	 *
	 * @param {*} cardDTO
	 * @returns
	 */
	newCardState(cardDTO) {
		return new CardState(cardDTO);
	}
}

function Project() {
	const [isEditCardModalVisible, setIsEditCardModalVisible] = useState(false);
	const [isProjectUsersModalVisible, setIsProjectUsersModalVisible] = useState(false);

	const { projectId, cardId } = useParams();
	const { newPopup } = useSystemPopups();
	const { participate, leave } = useProjectAuthentication();

	const projectSocketRef = useRef(null);
	const projectStateRef = useRef(null);

	const phasesContainerRef = useRef(null);
	const phasesContainerScrollBarRef = useRef(null);

	const lazyLoaderTopOffsetRef = useRef(null);
	const lazyLoaderBottomOffsetRef = useRef(null);

	const lazyLoaderRef = useRef(null);
	const dragableModalDropLocationRef = useRef(null);

	const dragableModalOnDragBeginRef = useRef(null);
	const dragableModalOnDragEndRef = useRef(null);
	const dragableModalOnDragMoveRef = useRef(null);

	const performLazyLoaderUpdateRef = useRef(null);
	const onProjectUnmountCallbackRef = useRef(null);

	const [waitingForReconnect, setWaitingForReconnect] = useState(false);
	const [redirectToHome, setRedirectToHome] = useState(false);

	// ============================== Edição de um card ============================== //
	/**
	 * Abre o modal de edição de um card.
	 */
	function toggleEditCardModal() {
		setIsEditCardModalVisible(!isEditCardModalVisible);
	}

	// ============================== Usuários do projeto ============================== //
	/**
	 * Abre o modal de usuários do projeto.
	 */
	function toggleProjectUsersModal() {
		setIsProjectUsersModalVisible(!isProjectUsersModalVisible);
	}

	// ============================== Socket ============================== //
	useEffect(() => {
		async function connect() {
			// Pega o socket do projeto, caso exista
			const project = (await participate(parseInt(projectId)))?.localProjectInstance;
			if (!project) {
				return undefined;
			}

			const { socket, projectName } = project;
			if (!socket || !socket.connected) {
				return undefined;
			}

			const newProjectState = new ProjectState(socket);

			// Atualiza as referências do projeto
			projectStateRef.current = newProjectState;
			projectSocketRef.current = socket;

			document.title = `Fluida | ${projectName}`;

			// Funções de resposta do servidor
			const disconnect = (reason) => {
				if (!reason.active) {
					// Remove a sessão do projeto
					projectSocketRef.current = null;
					projectStateRef.current = null;
					setRedirectToHome(true);
				} else {
					setWaitingForReconnect(true);
				}
			};

			const connect = () => {
				setWaitingForReconnect(false);
			};

			const phaseCreated = (...data) => newProjectState.phaseCreated(data);
			const phaseUpdated = (...data) => newProjectState.phaseUpdated(data);
			const phaseDeleted = (...data) => newProjectState.phaseDeleted(data);
			const phaseMoved = (...data) => newProjectState.phaseMoved(data);

			const cardCreated = (...data) => newProjectState.cardCreated(data);
			const cardUpdated = (...data) => newProjectState.cardUpdated(data);
			const cardDeleted = (...data) => newProjectState.cardDeleted(data);
			const cardMoved = (...data) => newProjectState.cardMoved(data);

			const phasesFetched = (...data) => newProjectState.phasesFetched(data);
			const cardsFetched = (...data) => newProjectState.cardsFetched(data);

			// Adiciona os listeners
			socket.on("disconnect", disconnect);
			socket.on("connect", connect);

			socket.on("phaseCreated", phaseCreated);
			socket.on("phaseUpdated", phaseUpdated);
			socket.on("phaseDeleted", phaseDeleted);
			socket.on("phaseMoved", phaseMoved);

			socket.on("cardCreated", cardCreated);
			socket.on("cardUpdated", cardUpdated);
			socket.on("cardDeleted", cardDeleted);
			socket.on("cardMoved", cardMoved);

			socket.on("phasesFetched", phasesFetched);
			socket.on("cardsFetched", cardsFetched);

			// Listeners do estado do projeto
			const unbindOnProjectPhaseStateChange = newProjectState.onProjectPhasesStateChange((phases) => {
				performLazyLoaderUpdateRef.current();
			});

			onProjectUnmountCallbackRef.current = () => {
				leave(projectId).catch((error) => console.error(`Ocorreu um erro ao sair do projeto: ${error.message}`));

				// Remove os listeners
				socket.off("disconnect", disconnect);
				socket.off("connect", connect);

				socket.off("phaseCreated", phaseCreated);
				socket.off("phaseUpdated", phaseUpdated);
				socket.off("phaseDeleted", phaseDeleted);
				socket.off("phaseMoved", phaseMoved);

				socket.off("cardCreated", cardCreated);
				socket.off("cardUpdated", cardUpdated);
				socket.off("cardDeleted", cardDeleted);
				socket.off("cardMoved", cardMoved);

				socket.off("phasesFetched", phasesFetched);
				socket.off("cardsFetched", cardsFetched);

				unbindOnProjectPhaseStateChange();
			};
		}

		// Conecta ao projeto
		connect();

		return () => {
			if (!onProjectUnmountCallbackRef.current) {
				return undefined;
			}

			onProjectUnmountCallbackRef.current();
		};
	}, []);

	return redirectToHome ? (
		<Navigate to="/" />
	) : (
		<div style={{ overflowX: "hidden" }}>
			<HomeHeader onUsersInProjectClick={toggleProjectUsersModal} />
			<ConnectionFailure connectionFailure={waitingForReconnect} />

			{isEditCardModalVisible && <EditCard />}

			{isProjectUsersModalVisible && <ProjectUsers projectState={projectStateRef.current} />}
			<Backdrop show={isProjectUsersModalVisible} onClick={toggleProjectUsersModal} />

			{projectStateRef.current && (
				<div className="P-background" ref={phasesContainerScrollBarRef}>
					<div className="P-phases-container-holder">
						<ol className="P-phases-container" ref={phasesContainerRef}>
							<div ref={lazyLoaderTopOffsetRef} />
							<DragableModalDropLocationWithLazyLoader
								lazyLoaderRef={lazyLoaderRef}
								// Função para criar um placeholder
								createPlaceholder={(setPlaceholder, { order }) => {
									return (
										<div
											className="PP-background PP-background-placeholder"
											style={{ order: order + 1 }}
											ref={(element) => setPlaceholder(element)}
										/>
									);
								}}
								// Referência para o dragable modal
								getComponentFromRef={(ref) => {
									return ref.current?.children?.[0];
								}}
								// Função para obter a ordem de um elemento
								getComponentOrderFromData={({ phaseDTO }) => {
									return phaseDTO?.order;
								}}
								// Referências das funções de drag
								dragBeginRef={dragableModalOnDragBeginRef}
								dragEndRef={dragableModalOnDragEndRef}
								dragMoveRef={dragableModalOnDragMoveRef}
								// Função chamada quando o drag é concluído
								dragConcludedCallback={({ phaseDTO }, newPosition) => {
									const phaseState = projectStateRef.current?.getPhaseState(phaseDTO?.phaseId);
									if (!phaseState) {
										return null;
									}

									// "Salva" a ordem atual da fase
									const currentPhaseOrder = phaseState.phaseDTO.order;

									// Para caso a nova posição seja posterior a posição atual
									newPosition += newPosition <= currentPhaseOrder ? 1 : 0;

									if (currentPhaseOrder == newPosition) {
										return null;
									}

									projectSocketRef.current?.emit(
										"movePhase",
										{ phaseId: phaseDTO?.phaseId, targetPositionIndex: newPosition },
										(success, data) => {
											!success &&
												newPopup("Common", { severity: "error", message: "Erro ao mover a fase" });
										}
									);

									// Ajusta a ordem das outras fases
									projectStateRef.current?.getPhases().forEach((phaseState) => {
										if (phaseState.phaseDTO.phaseId == phaseDTO.phaseId) {
											return null;
										}

										if (
											phaseState.phaseDTO.order < currentPhaseOrder &&
											phaseState.phaseDTO.order >= newPosition
										) {
											phaseState.phaseDTO.order += 1;
										} else if (
											phaseState.phaseDTO.order > currentPhaseOrder &&
											phaseState.phaseDTO.order <= newPosition
										) {
											phaseState.phaseDTO.order -= 1;
										}
									});

									// Atualiza a ordem da fase
									phaseState.phaseDTO.order = newPosition;

									// Atualiza a ordem das fases
									performLazyLoaderUpdateRef.current();
								}}
							>
								<LazyLoader
									// Função para atualizar o lazy loader
									update={performLazyLoaderUpdateRef}
									// Referências para os offsets
									topLeftOffset={lazyLoaderBottomOffsetRef}
									bottomRightOffset={lazyLoaderBottomOffsetRef}
									// Container e barra de rolagem
									container={phasesContainerRef}
									scrollBar={phasesContainerScrollBarRef}
									// Função para construir os elementos
									constructElement={(phase, _, isLoading, setReference) => (
										<Phase
											isLoading={isLoading}
											phase={phase}
											projectState={projectStateRef}
											currentProjectSocket={projectSocketRef}
											dragBegin={dragableModalOnDragBeginRef.current}
											dragEnd={dragableModalOnDragEndRef.current}
											dragMove={dragableModalOnDragMoveRef.current}
											ref={(element) => setReference(element)}
										/>
									)}
									// Dimensões dos elementos
									width={320}
									margin={20}
									padding={20}
									// Direção de rolagem
									direction={"horizontal"}
									// Funções de controle do conteúdo
									fetchMore={(page) => {
										return new Promise((resolve, reject) => {
											return projectSocketRef.current?.emit("fetchPhases", { page }, (response) => {
												resolve(response?.phases?.taken || []);
											});
										});
									}}
									getAvailableContentCountForFetch={async (sync = false) => {
										return await projectStateRef.current?.getTotalPhases(sync);
									}}
									insertFetchedElement={(element) => {
										return projectStateRef.current?.phaseCreated([element], true, true);
									}}
									// Tamanho da página
									pageSize={10}
									// Função para obter o conteúdo
									getContent={() => projectStateRef.current?.getPhases()}
									// Referência para o lazy loader
									ref={lazyLoaderRef}
								/>
							</DragableModalDropLocationWithLazyLoader>
							<div ref={lazyLoaderBottomOffsetRef} />
						</ol>

						<div className="P-add-new-phase-button-container">
							<button
								className="P-add-new-phase-button"
								onClick={() => {
									projectSocketRef.current?.emit("createPhase", { phaseName: "Nova Fase" }, (success, data) => {
										success
											? newPopup("Common", { severity: "success", message: "Fase criada com sucesso" })
											: newPopup("Common", { severity: "error", message: "Erro ao criar a fase" });
									});
								}}
							>
								<AddButtonIcon className="P-add-new-phase-button-icon" />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Project;
