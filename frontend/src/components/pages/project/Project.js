import "./Project.css";

import { Navigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { ReactComponent as AddButtonIcon } from "assets/action-icons/add-circle-unlined.svg";

import Backdrop from "components/shared/backdrop/Backdrop";
import ConnectionFailure from "./ConnectionFailure";
import DragableModalDropLocationWithLazyLoader from "utilities/dragable-modal/drop-location/DragableModalDropLocationWithLazyLoader";
import EditCard from "./edit-card/EditCard";
import HomeHeader from "components/shared/login-registration/header-home/HeaderHome";
import LazyLoader from "utilities/lazy-loader/LazyLoader";
import MouseScrollableModal from "utilities/MouseScrollableModal/MouseScrollableModal";
import Phase from "./templates/phase/Phase";
import ProjectUsers from "./project-users/ProjectUsers";
import PhaseConfiguration from "./phase-configuration/PhaseConfiguration";
import ReactSubscriptionHelper from "utilities/react-subscription-helper/ReactSubscriptionHelper";

import { useProjectAuthentication } from "context/ProjectAuthenticationContext";
import { useSystemPopups } from "context/popup/SystemPopupsContext";

function Project() {
	const { newPopup } = useSystemPopups();

	const [cardBeingEdited, setCardBeingEdited] = useState(null);
	const [phaseBeingConfigurated, setPhaseBeingConfigurated] = useState(null);
	const [isProjectUsersModalVisible, setIsProjectUsersModalVisible] = useState(false);

	const { projectId, cardId } = useParams();
	const { participate, leave } = useProjectAuthentication();

	const projectSocketRef = useRef(null);
	const projectStateRef = useRef(null);

	const phasesContainerScrollBarRef = useRef(null);

	const lazyLoaderTopOffsetRef = useRef(null);
	const lazyLoaderBottomOffsetRef = useRef(null);

	const lazyLoaderRef = useRef(null);

	const dragableModalDropLocationRef = useRef(null);
	const mouseScrollableModalRef = useRef(null);

	const dragableModalOnDragBeginRef = useRef(null);
	const dragableModalOnDragEndRef = useRef(null);
	const dragableModalOnDragMoveRef = useRef(null);

	const performLazyLoaderUpdateRef = useRef(null);
	const onProjectUnmountCallbackRef = useRef(null);

	const [waitingForReconnect, setWaitingForReconnect] = useState(false);
	const [redirectToHome, setRedirectToHome] = useState(false);

	// ============================== Classes ============================== //
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
		totalCardsSynced = false;

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

						this.#projectMembersStateListeners.notify({ members });
					});
				}

				fetchProjectMembers();
			})
				.then(() => {})
				.catch(() => {});

			this.#socket = socket;
		}

		get MembersSubscription() {
			return this.#projectMembersStateListeners;
		}

		get PhasesSubscription() {
			return this.#projectPhasesStateListeners;
		}

		get CardsSubscription() {
			return this.#projectCardsStateListeners;
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
		onProjectCardsStateChange(phaseId, callback) {
			if (!(phaseId in this.#projectCardsStateListeners)) {
				this.#projectCardsStateListeners[phaseId] = new ReactSubscriptionHelper();
			}

			return this.#projectCardsStateListeners[phaseId].subscribe(callback);
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
			const phaseState = this.getPhaseState(phaseId);
			if (!phaseState) {
				return 0;
			}

			return new Promise((resolve) => {
				// Caso sync = true ou o número total de cards na fase ainda não tenha sido sincronizado, então é feito um fetch do número total de cards
				// Caso contrário, é retornado o número total de cards local
				if (!phaseState.totalCardsSynced && !sync) {
					return this.#socket.emit("getTotalCards", { phaseId }, (response) => {
						let retrievedCount = response?.amount;

						// Se o número total de cards foi retornado, então o número total de cards foi sincronizado
						if (retrievedCount != undefined) {
							phaseState.totalCards = retrievedCount;
							phaseState.totalCardsSynced = true;
						}

						resolve(phaseState.totalCards);
					});
				}

				return resolve(phaseState.totalCards);
			});
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
		phaseUpdated(data /* updatedPhaseDTOFields */) {
			const { phaseId, newPhaseName } = data?.[0];

			// Pega o índice da fase removida
			const phaseIndex = this.phases.findIndex((phaseState) => phaseState?.phaseDTO?.phaseId == phaseId);
			if (phaseIndex == -1) {
				return null;
			}

			const { phaseDTO } = this.phases[phaseIndex];
			phaseDTO.phaseName = newPhaseName;

			this.#projectPhasesStateListeners.notify(phaseDTO);
		}

		/**
		 * Resposta do servidor para a remoção de uma fase.
		 *
		 * @param {number} phaseId
		 */
		phaseDeleted(data) {
			const { phaseId } = data?.[0];

			// Pega o índice da fase removida
			const phaseIndex = this.phases.findIndex((phaseState) => phaseState?.phaseDTO?.phaseId == phaseId);
			if (phaseIndex == -1) {
				return null;
			}

			const { phaseDTO } = this.phases[phaseIndex];

			// Remove a fase do estado do projeto
			this.phases.splice(phaseIndex, 1);

			// Remove a fase do mapa
			delete this.phasesMap[phaseId];

			// Decrementa o número total de fases
			this.totalPhases -= 1;

			if (phaseId in this.#projectCardsStateListeners) {
				delete this.#projectCardsStateListeners[phaseId];
			}

			this.#projectPhasesStateListeners.notify(phaseDTO);
		}

		/**
		 * Resposta do servidor para a movimentação de uma fase.
		 *
		 * @param {number} phaseId
		 * @param {number} oldPositionIndex
		 * @param {number} targetPositionIndex
		 */
		phaseMoved(phaseId, oldPositionIndex, targetPositionIndex) {}

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
			this.#projectCardsStateListeners[cardDTO.phaseId]?.notify(cardDTO);
			this.#projectCardsStateListeners[-1]?.notify(cardDTO);

			return cardState;
		}

		/**
		 * Resposta do servidor para a atualização de um card.
		 *
		 * @param {number} cardId
		 * @param {Object} updatedCardDTOFields
		 */
		cardUpdated(data /*updatedCardDTOFields*/) {
			const { phaseId, cardId, newCardName, newCardDescription } = data?.[0];

			const phaseState = this.getPhaseState(phaseId);
			if (!phaseState) {
				return null;
			}

			// Pega o índice da fase removida
			const cardIndex = phaseState.cards.findIndex((cardState) => cardState?.cardDTO?.cardId == cardId);
			if (cardIndex == -1) {
				return null;
			}

			const { cardDTO } = phaseState.cards[cardIndex];

			cardDTO.cardName = newCardName || cardDTO.cardName;
			cardDTO.cardDescription = newCardDescription || cardDTO.cardDescription;

			this.#projectCardsStateListeners[cardDTO.phaseId]?.notify(cardDTO);
			this.#projectCardsStateListeners[-1]?.notify(cardDTO);
		}

		/**
		 * Resposta do servidor para a remoção de um card.
		 *
		 * @param {number} cardId
		 */
		cardDeleted(data) {
			const { phaseId, cardId } = data?.[0];

			const phaseState = this.getPhaseState(phaseId);
			if (!phaseState) {
				return null;
			}

			// Pega o índice do card removida
			const cardIndex = phaseState.cards.findIndex((cardState) => cardState.cardDTO.cardId == cardId);
			if (cardIndex == -1) {
				return null;
			}

			const { cardDTO } = phaseState.cards[cardIndex];

			// Remove o card do estado da fase
			phaseState.cards.splice(cardIndex, 1);

			// Remove o card do mapa
			delete phaseState.cardsMap[cardId];

			// Decrementa o número total de cards
			phaseState.totalCards -= 1;

			this.#projectCardsStateListeners[phaseId]?.notify(cardDTO);
			this.#projectCardsStateListeners[-1]?.notify(cardDTO);
		}

		/**
		 * Resposta do servidor para a movimentação de um card.
		 *
		 * @param {number} cardId
		 * @param {number} oldPositionIndex
		 * @param {number} targetPositionIndex
		 * @param {number} targetPhaseId
		 * @param {number} targetPhasePositionIndex
		 */
		cardMoved(phaseId, cardId, oldPositionIndex, targetPositionIndex, targetPhaseId, targetPhasePositionIndex) {}

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

		// ============================== Funções de requisição ============================== //
		/**
		 * Faz o request para criar a Fase
		 *
		 * @param {*} phaseName
		 * @returns
		 */
		requestCreateNewPhase(phaseName = "Nova Fase") {
			return new Promise((resolve) => {
				this.#socket.emit("createPhase", { phaseName }, (success, data) => {
					success
						? newPopup("Common", {
								severity: "success",
								message: "Fase criada com sucesso",
						  })
						: newPopup("Common", {
								severity: "error",
								message: "Erro ao criar a fase",
						  });

					resolve(success);
				});
			});
		}

		/**
		 * Faz o request para deletar a Fase
		 *
		 * @param {*} phaseId
		 * @returns
		 */
		requestDeletePhase(phaseId) {
			return new Promise((resolve) => {
				this.#socket.emit("deletePhase", { phaseId }, (success, data) => {
					success
						? newPopup("Common", {
								severity: "success",
								message: "Fase excluída com sucesso",
						  })
						: newPopup("Common", {
								severity: "error",
								message: "Erro ao excluír a fase",
						  });

					resolve(success);
				});
			});
		}

		/**
		 * Faz o request para atualizar o nome da Fase
		 *
		 * @param {*} phaseId
		 * @param {*} newPhaseName
		 * @returns
		 */
		requestUpdatePhase(phaseId, newPhaseName) {
			return new Promise((resolve) => {
				this.#socket.emit("updatePhase", { phaseId, newPhaseName }, (success, data) => {
					success
						? newPopup("Common", {
								severity: "success",
								message: "Fase atualizada com sucesso",
						  })
						: newPopup("Common", {
								severity: "error",
								message: "Erro ao atualizar a fase",
						  });

					resolve(success);
				});
			});
		}

		/**
		 *	Faz o request para criar o Card
		 *
		 * @param {*} phaseId
		 * @param {*} cardName
		 * @returns
		 */
		requestCreateNewCard(phaseId, cardName = "Novo Card") {
			return new Promise((resolve) => {
				this.#socket.emit("createCard", { phaseId, cardName }, (success, data) => {
					success
						? newPopup("Common", {
								severity: "success",
								message: "Card criado com sucesso",
						  })
						: newPopup("Common", {
								severity: "error",
								message: "Erro ao criar o card",
						  });

					resolve(success);
				});
			});
		}

		/**
		 * Faz o request para atualizar o nome do card
		 *
		 * @param {*} cardId
		 * @param {*} newCardName
		 * @param {*} newCardDescription
		 * @returns
		 */
		requestUpdateCard(cardId, newCardName, newCardDescription) {
			return new Promise((resolve) => {
				this.#socket.emit("updateCard", { cardId, newCardName, newCardDescription }, (success, data) => {
					success
						? newPopup("Common", {
								severity: "success",
								message: "Card atualizado com sucesso",
						  })
						: newPopup("Common", {
								severity: "error",
								message: "Erro ao atualizar o card",
						  });

					resolve(success);
				});
			});
		}

		/**
		 * Faz o request para excluir o card
		 *
		 * @param {*} cardId
		 * @returns
		 */
		requestDeleteCard(cardId) {
			return new Promise((resolve) => {
				this.#socket.emit("deleteCard", { cardId }, (success, data) => {
					success
						? newPopup("Common", {
								severity: "success",
								message: "Card excluído com sucesso",
						  })
						: newPopup("Common", {
								severity: "error",
								message: "Erro ao excluído o card",
						  });

					resolve(success);
				});
			});
		}

		// ============================== Funções intermeditárias ============================== //
		previewCard(cardState) {
			setCardBeingEdited(cardState);
		}

		previewPhaseConfiguration(phaseState) {
			setPhaseBeingConfigurated(phaseState);
		}

		dismissCardPreview() {
			setCardBeingEdited(null);
		}

		dismissPhaseConfigurationPreview() {
			setPhaseBeingConfigurated(null);
		}
	}

	// ============================== Edição de um card ============================== //
	/**
	 * Abre o modal de edição de um card.
	 */
	function toggleEditCardModal() {
		setCardBeingEdited(null);
	}

	// ============================== Configuração da fase ============================== //
	/**
	 *
	 */
	function togglePhaseConfigurationModal() {
		setPhaseBeingConfigurated(null);
	}

	// ============================== Usuários do projeto ============================== //
	/**
	 * Abre o modal de usuários do projeto.
	 */
	function toggleProjectUsersModal() {
		setIsProjectUsersModalVisible(false);
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

			const phaseCreated = (...data) => projectStateRef.current.phaseCreated(data);
			const phaseUpdated = (...data) => projectStateRef.current.phaseUpdated(data);
			const phaseDeleted = (...data) => projectStateRef.current.phaseDeleted(data);
			const phaseMoved = (...data) => projectStateRef.current.phaseMoved(data);

			const cardCreated = (...data) => projectStateRef.current.cardCreated(data);
			const cardUpdated = (...data) => projectStateRef.current.cardUpdated(data);
			const cardDeleted = (...data) => projectStateRef.current.cardDeleted(data);
			const cardMoved = (...data) => projectStateRef.current.cardMoved(data);

			const phasesFetched = (...data) => projectStateRef.current.phasesFetched(data);
			const cardsFetched = (...data) => projectStateRef.current.cardsFetched(data);

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

			// Listener para quando o estado das fases do projeto mudar
			const unbindOnPhaseStateChangeLazyLoaderUpdate = projectStateRef.current.onProjectPhasesStateChange((phaseDTO) => {
				performLazyLoaderUpdateRef.current?.();
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

				unbindOnPhaseStateChangeLazyLoaderUpdate();
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

	useEffect(() => {
		if (projectStateRef.current == null) {
			return undefined;
		}

		// Listener para quando o estado dos cards do projeto mudar
		return projectStateRef.current?.onProjectCardsStateChange(-1, (cardDTO) => {
			// Invalida o EditCard caso o card sendo editado tenha sido deletado
			if (cardBeingEdited?.cardDTO?.cardId == cardDTO.cardId) {
				toggleEditCardModal();
			}
		});
	}, [projectStateRef, cardBeingEdited]);

	useEffect(() => {
		if (projectStateRef.current == null) {
			return undefined;
		}

		// Listener para quando o estado das fase do projeto mudar
		return projectStateRef.current?.onProjectPhasesStateChange((phaseDTO) => {
			// Invalida o PhaseConfiguration caso a fase sendo configurada tenha sido deletada
			if (phaseBeingConfigurated?.phaseDTO?.phaseId == phaseDTO.phaseId) {
				togglePhaseConfigurationModal();
			}
		});
	}, [projectStateRef, phaseBeingConfigurated]);

	return redirectToHome ? (
		<Navigate to="/" />
	) : (
		<div style={{ overflowX: "hidden" }}>
			<HomeHeader onUsersInProjectClick={toggleProjectUsersModal} />
			<ConnectionFailure connectionFailure={waitingForReconnect} />

			{cardBeingEdited != null && <EditCard projectState={projectStateRef} card={cardBeingEdited} />}
			<Backdrop show={cardBeingEdited != null} onClick={toggleEditCardModal} />

			{phaseBeingConfigurated != null && <PhaseConfiguration projectState={projectStateRef} phase={phaseBeingConfigurated} />}
			<Backdrop show={phaseBeingConfigurated != null} onClick={togglePhaseConfigurationModal} />

			{isProjectUsersModalVisible && <ProjectUsers projectState={projectStateRef} />}
			<Backdrop show={isProjectUsersModalVisible} onClick={toggleProjectUsersModal} />

			{projectStateRef.current && (
				<div className="P-background" ref={phasesContainerScrollBarRef}>
					<div className="P-phases-container-holder">
						<ol className="P-phases-container">
							<div ref={lazyLoaderTopOffsetRef} />
							<MouseScrollableModal scrollableDivRef={phasesContainerScrollBarRef} ref={mouseScrollableModalRef}>
								<DragableModalDropLocationWithLazyLoader
									// Referência para a div que será arrastada
									scrollableDivRef={phasesContainerScrollBarRef}
									// Referência para o LazyLoader
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

										if (currentPhaseOrder == newPosition) {
											return null;
										}

										projectSocketRef.current?.emit(
											"movePhase",
											{
												phaseId: phaseDTO?.phaseId,
												targetPositionIndex: newPosition,
											},
											(success, data) => {
												!success &&
													newPopup("Common", {
														severity: "error",
														message: "Erro ao mover a fase",
													});
											}
										);

										// Ajusta a ordem das outras fases
										projectStateRef.current?.getPhases().forEach((phaseState) => {
											if (phaseState == undefined || phaseState.phaseDTO.phaseId == phaseDTO.phaseId) {
												return null;
											}

											if (phaseState.phaseDTO.order < currentPhaseOrder && phaseState.phaseDTO.order >= newPosition) {
												phaseState.phaseDTO.order += 2;
											} else if (phaseState.phaseDTO.order > currentPhaseOrder && phaseState.phaseDTO.order <= newPosition) {
												phaseState.phaseDTO.order -= 2;
											}
										});

										// Atualiza a ordem da fase
										phaseState.phaseDTO.order = newPosition;

										// Atualiza a ordem das fases
										performLazyLoaderUpdateRef.current();
									}}
								>
									<LazyLoader
										fff1={true}
										className="P-phases-container-lazy-loader"
										// Função para atualizar o lazy loader
										update={performLazyLoaderUpdateRef}
										// Referências para os offsets
										topLeftOffset={lazyLoaderTopOffsetRef}
										bottomRightOffset={lazyLoaderBottomOffsetRef}
										// Referência para o scroll bar
										scrollBarRef={phasesContainerScrollBarRef}
										// Função para construir os elementos
										constructElement={(phase, _, isLoading, setReference) => (
											<Phase
												scrollableDivRef={phasesContainerScrollBarRef}
												isLoading={isLoading}
												phase={phase}
												projectStateRef={projectStateRef}
												projectSocketRef={projectSocketRef}
												callbacks={{
													dragBegin: [
														() => {
															mouseScrollableModalRef.current?.enableMouseScrolling();
														},
														dragableModalOnDragBeginRef.current,
													],
													dragEnd: [
														() => {
															mouseScrollableModalRef.current?.disableMouseScrolling();
														},
														dragableModalOnDragEndRef.current,
													],
													dragMove: [dragableModalOnDragMoveRef.current],
												}}
												ref={(element) => setReference(element)}
											/>
										)}
										// Dimensões dos elementos
										width={280}
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
										pageSize={100}
										// Função para obter o conteúdo
										getContent={() => projectStateRef.current?.getPhases() || []}
										// Referência para o lazy loader
										ref={lazyLoaderRef}
									/>
								</DragableModalDropLocationWithLazyLoader>
							</MouseScrollableModal>
							<div ref={lazyLoaderBottomOffsetRef} />
						</ol>

						<div className="P-add-new-phase-button-container">
							<button className="P-add-new-phase-button" onClick={() => projectStateRef.current?.requestCreateNewPhase("Nova Fase")}>
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
