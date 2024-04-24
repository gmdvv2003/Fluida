import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useProjectAuthentication } from "context/ProjectAuthenticationContext";

import { ReactComponent as AddButtonIcon } from "assets/action-icons/add-circle-unlined.svg";

import HomeHeader from "../../shared/login-registration/header-home/HeaderHome";

import Phase from "./templates/phase/Phase";
import Card from "./templates/card/Card";

import LazyLoader from "utilities/lazy-loader/LazyLoader";

import "./Project.css";

class CardState {
	constructor(cardId) {
		this.cardId = cardId;
	}
}

class PhaseState {
	cards = [];
	cardsMap = {};

	constructor(phaseId) {
		this.phaseId = phaseId;
	}
}

class ProjectState {
	phases = [];
	phasesMap = {};

	getPhaseState(phaseId) {
		return this.phasesMap[phaseId];
	}

	getCardState(phaseId, cardId) {
		return this.getPhaseState(phaseId)?.cardsMap[cardId];
	}

	getPhases() {
		return this.phases;
	}

	phaseCreated(phaseDTO) {}
}

function Project() {
	const [currentProjectSocket, setCurrentProjectSocket] = useState(null);

	const { projectId, cardId } = useParams();
	const { getProjectSession } = useProjectAuthentication();

	const [projectState, setProjectState] = useState(null);

	const phasesContainerRef = useRef(null);
	const phasesContainerScrollBarRef = useRef(null);

	useEffect(() => {
		const socket = null; // const { socket } = getProjectSession(projectId);
		setCurrentProjectSocket(socket);

		if (!socket) {
			return undefined;
		}

		const newProjectState = new ProjectState();
		setProjectState(newProjectState);

		// socket.on("disconnect", () => {
		// 	setCurrentProjectSocket(null);
		// });

		// const phaseCreated = (...data) => newProjectState.phaseCreated;
		// const phaseUpdated = (...data) => newProjectState.phaseUpdated;
		// const phaseDeleted = (...data) => newProjectState.phaseDeleted;
		// const phaseMoved = (...data) => newProjectState.phaseMoved;

		// const cardCreated = (...data) => newProjectState.cardCreated;
		// const cardUpdated = (...data) => newProjectState.cardUpdated;
		// const cardDeleted = (...data) => newProjectState.cardDeleted;
		// const cardMoved = (...data) => newProjectState.cardMoved;

		// socket.on("phaseCreated", (phaseDTO) => {});
		// socket.on("phaseUpdated", (phaseId, updatedPhaseDTOFields) => {});
		// socket.on("phaseDeleted", (phaseId) => {});
		// socket.on("phaseMoved", (phaseId, targetPositionIndex) => {});

		// socket.on("cardCreated", (cardDTO) => {});
		// socket.on("cardUpdated", (cardId, updatedCardDTOFields) => {});
		// socket.on("cardDeleted", (cardId) => {});
		// socket.on("cardMoved", (cardId, targetPhaseIndex, targetPositionIndex) => {});

		// return () => {
		// 	socket.off("phaseCreated", phaseCreated);
		// 	socket.off("phaseUpdated", phaseUpdated);
		// 	socket.off("phaseDeleted", phaseDeleted);
		// 	socket.off("phaseMoved", phaseMoved);

		// 	socket.off("cardCreated", cardCreated);
		// 	socket.off("cardUpdated", cardUpdated);
		// 	socket.off("cardDeleted", cardDeleted);
		// 	socket.off("cardMoved", cardMoved);

		// 	setCurrentProjectSocket(null);
		// };
	}, [projectId, getProjectSession]);

	useEffect(() => {}, [cardId]);

	const x = [];
	for (let i = 0; i < 1000; i++) {
		x.push(<Phase cards={[]} />);
	}

	return (
		<div style={{ overflowX: "hidden" }}>
			<HomeHeader />
			<div className="P-background" ref={phasesContainerScrollBarRef}>
				<div className="P-phases-container-holder">
					<div className="P-phases-container" ref={phasesContainerRef}>
						<LazyLoader
							container={phasesContainerRef}
							scrollBar={phasesContainerScrollBarRef}
							direction="horizontal"
							width={320}
							margin={8}
							padding={20}
							getContent={() => x}
						/>
						{x.map((item) => item)}
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
