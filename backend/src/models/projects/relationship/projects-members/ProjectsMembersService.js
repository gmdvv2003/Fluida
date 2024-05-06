const { Page } = require("../../../../context/decorators/typeorm/pagination/Pagination");

const Service = require("../../../__types/Service");

const ProjectsMembersDTO = require("./ProjectsMembersDTO");
const ProjectsMembersRepository = require("./ProjectsMembersRepository");

class ProjectMembersService extends Service {
	#ProjectsMembersRepository;

	constructor() {
		super();
		this.#ProjectsMembersRepository = new ProjectsMembersRepository(this);
	}

	/**
	 * Retorna os membros de um projeto.
	 *
	 * @param {Object} pageOptions { PAGE: number, PAGE_SIZE: number }
	 * @param {number} projectId
	 * @returns {Page}
	 */
	async getMembersOfProject(pageOptions, projectId) {
		return await this.#ProjectsMembersRepository.getMembersOfProject(pageOptions, projectId);
	}

	/**
	 * Retorna os projetos de um usuário.
	 *
	 * @param {Object} pageOptions { PAGE: number, PAGE_SIZE: number }
	 * @param {number} userId
	 * @returns {Page}
	 */
	async getProjectsOfUser(pageOptions, userId) {
		return this.#ProjectsMembersRepository.getProjectsOfUser(pageOptions, userId);
	}

	/**
	 * Adiciona um usuário como membro de um projeto.
	 *
	 * @param {number} userId
	 * @param {number} projectId
	 * @returns {boolean}
	 */
	async addUserAsMemberOfProject(userId, projectId) {
		return await this.#ProjectsMembersRepository.addUserAsMemberOfProject(new ProjectsMembersDTO({ userId, projectId }));
	}

	/**
	 * Remove um usuário dos membros de um projeto.
	 *
	 * @param {number} userId
	 * @param {number} projectId
	 * @returns {boolean}
	 */
	async removeUserFromMembersOfProject(userId, projectId) {
		return await this.#ProjectsMembersRepository.removeUserFromMembersOfProject(new ProjectsMembersDTO({ userId, projectId }));
	}

	/**
	 * Indica se o usuário é membro do projeto.
	 *
	 * @param {number} userId
	 * @param {number} projectId
	 * @returns {boolean}
	 */
	async isUserMemberOfProject(userId, projectId) {
		return await this.#ProjectsMembersRepository.isUserMemberOfProject(new ProjectsMembersDTO({ userId, projectId }));
	}
}

module.exports = ProjectMembersService;
