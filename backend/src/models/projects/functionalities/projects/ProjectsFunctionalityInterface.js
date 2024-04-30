// Type linting
const UsersDTO = require("../../../users/UsersDTO");

const { Socket, Namespace, Server } = require("socket.io");

const CardFunctionality = require("./modules/Card/CardFunctionality");
const PhaseFunctionality = require("./modules/Phase/PhaseFunctionality");
const MembersFunctionality = require("./modules/Members/MembersFunctionality");
const ChatFunctionality = require("./modules/Chat/ChatFunctionality");
const ProjectFunctionality = require("./modules/Project/ProjectFunctionality");

const Session = require("../../../../context/session/Session");

const CardsDTO = require("../../../cards/CardsDTO");
const PhasesDTO = require("../../../phases/PhasesDTO");

const {
	DEFAULT_PAGE_SIZE,
	Page,
} = require("../../../../context/decorators/typeorm/pagination/Pagination");

/**
 * Injeta funcionalidades no projeto.
 *
 * @param {string} name
 * @param {Function} next
 */
function injectFunctionality(name, next, authenticateless) {
	this.injectProjectFunctionality(name, next, authenticateless);
}

class Participant {
	subscribed = false;

	#user;
	#socketToken;

	constructor(user, socketToken) {
		this.#user = user;
		this.#socketToken = socketToken;
	}

	get user() {
		return this.#user;
	}

	get socketToken() {
		return this.#socketToken;
	}
}

class Project {
	projectId;
	ProjectsController;

	#cards = [];
	#phases = [];

	members = [];

	constructor(projectId, ProjectsController) {
		this.projectId = projectId;
		this.ProjectsController = ProjectsController;
	}

	/**
	 * Função auxiliar para buscar mais elementos de uma lista.
	 */
	async #fetchMore(list, fetchFunction, page, ...data) {
		const head = (page - 1) * DEFAULT_PAGE_SIZE;
		const tail = page * DEFAULT_PAGE_SIZE;

		if (list.length < tail) {
			for (let index = list.length; index < tail; index += 1) {
				list.push(undefined);
			}
		}

		const { taken, total, hasNextPage } = await fetchFunction({ PAGE: page }, ...data);
		for (let index = head; index < taken.length; index += 1) {
			list[index] = taken[index];
		}

		return { taken, hasNextPage, total };
	}

	/**
	 * Retorna os cards de uma fase.
	 *
	 * @param {number} page
	 * @param {number} phaseId
	 * @returns {Array}
	 */
	async getCards(page, phaseId) {
		const phasesCardsService = this.ProjectsController.PhasesService.PhasesCardsService;
		return await this.#fetchMore(
			this.#cards,
			phasesCardsService.getCardsOfPhase,
			page,
			phaseId
		);
	}

	/**
	 * Retorna o total de cards em uma fase.
	 *
	 * @param {number} phaseId
	 * @returns {number}
	 */
	async getTotalCardsInPhase(phaseId) {
		const projectsPhasesService = this.ProjectsController.Service.ProjectsPhasesService;
		return await projectsPhasesService.getTotalPhasesInProject(phaseId);
	}

	/**
	 * Retorna as fases do projeto.
	 *
	 * @param {number} page
	 * @returns {Array}
	 */
	async getPhases(page) {
		const projectsPhasesService = this.ProjectsController.Service.ProjectsPhasesService;
		return await this.#fetchMore(this.#phases, projectsPhasesService.getPhasesOfProject, page);
	}

	/**
	 * Retorna o total de fases do projeto.
	 *
	 * @returns {number}
	 */
	async getTotalPhasesInProject() {
		const phasesCardsService = this.ProjectsController.PhasesService.PhasesCardsService;
		return await phasesCardsService.getTotalCardsInPhase(this.projectId);
	}

	/**
	 * @param {CardsDTO} cardDTO
	 */
	addCard(cardDTO) {
		this.#cards.push(cardDTO);
	}

	/**
	 * @param {number} caseId
	 */
	removeCard(caseId) {
		this.#cards = this.#cards.filter((card) => card.cardId !== cardId);
	}

	/**
	 * @param {PhasesDTO} phaseDTO
	 */
	addPhase(phaseDTO) {
		this.#phases.push(phaseDTO);
	}

	/**
	 * @param {number} phaseId
	 */
	removePhase(phaseId) {
		this.#phases = this.#phases.filter((phase) => phase.phaseId !== phaseId);
	}
}

class ProjectsFunctionalityInterface {
	#projects = {};

	constructor(ProjectsController) {
		// Função de injeção de dependências
		const inject = injectFunctionality.bind(this);

		// Injetando dependências
		new CardFunctionality(this, inject);
		new PhaseFunctionality(this, inject);
		new MembersFunctionality(this, inject);
		new ChatFunctionality(this, inject);
		new ProjectFunctionality(this, inject);

		inject("IOSubscribeToProject", this.IOSubscribeToProject, true);
		inject("IOUnsubscribeFromProject", this.IOUnsubscribeFromProject, true);

		this.ProjectsController = ProjectsController;
	}

	/**
	 * Middleware que redireciona o socket para o projeto correto.
	 *
	 * @param {Function} next
	 */
	socketToProjectRedirector(next) {
		return (projectsIO, socket, data) => {
			const { projectId } = socket;
			if (!projectId) {
				return socket.emit("error", { message: '"projectId" não informado.' });
			}

			// Verifica se o projeto existe
			const project = this.#projects[projectId];
			if (!project) {
				return socket.emit("error", { message: "Projeto não encontrado." });
			}

			// Verifica se o usuário é membro do projeto
			const isValidProjectMember = project.members.some((member) => {
				// Procura por um usuário que tenha o mesmo token de socket e que esteja inscrito no projeto
				return (
					member.socketToken === socket.handshake.auth.socketToken && member.subscribed
				);
			});
			if (!isValidProjectMember) {
				return socket.emit("error", { message: "Você não é membro deste projeto." });
			}

			try {
				next(projectsIO, socket, project, data);
			} catch (error) {
				socket.emit("error", { message: error.message });
			}
		};
	}

	/**
	 * Método utilizado para injetar funcionalidades no projeto.
	 *
	 * @param {string} name
	 * @param {Function} next
	 */
	injectProjectFunctionality(name, next, authenticateless = false) {
		this[name] = authenticateless
			? next.bind(this)
			: this.socketToProjectRedirector(next.bind(this));
	}

	/**
	 * Adiciona um usuário como participante de um projeto, criando também um token de participação.
	 *
	 * @param {UsersDTO} user
	 * @param {int} projectId
	 * @returns {[boolean, string]}
	 */
	addParticipant(user, projectId) {
		// "Cria" o projeto se ele não existir
		if (!this.#projects[projectId]) {
			this.#projects[projectId] = new Project(projectId, this.ProjectsController);
		}

		const project = this.#projects[projectId];

		// Verifica se o usuário já é membro do projeto
		if (project.members.includes(user)) {
			return [false, null];
		}

		// Cria um token de participação do usuário no projeto
		const participationToken = Session.newSession(
			{
				userId: user.userId,
				projectId: projectId,
			},
			// O ano é 12023, o token expirou e agora a civilização está apuros...
			{ expiresIn: "9999 years" }
		);

		// Adiciona o usuário ao projeto (mas ainda sem autorização de participação)
		project.members.push(new Participant(user, participationToken));

		return [true, participationToken];
	}

	removeParticipant(user, projectId) {}

	/**
	 * Realiza a inscrição de um usuário em um projeto.
	 *
	 * @param {Namespace} projectsIO
	 * @param {Socket} socket
	 * @param {Project} project
	 * @param {*} data
	 */
	IOSubscribeToProject(projectsIO, socket, data) {
		// Verifica se o projeto existe
		const project = this.#projects[data.projectId];
		if (!project) {
			return socket.emit("error", { message: "Projeto não encontrado." });
		}

		const { socketToken } = socket.handshake.auth;

		// Realiza a validação para obter o userId
		const [_, { userId }] = Session.validate(socketToken);

		// Procura o usuário nos membros do projeto
		const user = project.members.find((member) => {
			return member.user.userId === userId;
		});

		if (!user) {
			return socket.emit("error", { message: "Usuário não encontrado." });
		}

		// Adiciona o socket a sala do projeto
		socket.join(project.projectId);

		// Atualiza o status de inscrição do usuário
		user.subscribed = true;

		// Envia a confirmação de inscrição
		socket.emit("subscribedToProject");
	}

	/**
	 * Realiza a remoção de um usuário de um projeto, invalidando o token de participação.
	 *
	 * @param {Namespace} projectsIO
	 * @param {Socket} socket
	 * @param {Project} project
	 * @param {Object} data
	 */
	IOUnsubscribeFromProject(projectsIO, socket, data) {}
}

module.exports = { Participant, Project, ProjectsFunctionalityInterface };
