const { Like, InsertResult, DeleteResult } = require("typeorm");

const Repository = require("../../../__types/Repository");

const ProjectsMembersDTO = require("./ProjectsMembersDTO");
const ProjectsMembersEntity = require("./ProjectsMembersEntity");

const { Paginate, Page } = require("../../../../context/decorators/typeorm/pagination/Pagination");

class ProjectsMembersRepository extends Repository {
	constructor(service) {
		super(service, ProjectsMembersDTO);
	}

	/**
	 * Retorna todos os membros de um projeto do banco de dados.
	 *
	 * @param {number} projectId
	 * @returns {Page}
	 */
	@Paginate({ GROUP_BY: "userId" })
	async getMembersOfProject(projectId) {
		/**
		 * @type {import("typeorm").FindManyOptions<Entity>}
		 */
		const query = {
			// Filtra pelo id do projeto.
			where: { projectId: Like(`%${projectId}%`) },

			// Adiciona a relação com o usuário.
			relations: { user: true },

			// Seleciona apenas os campos necessários.
			select: { user: true, log: true },
		};

		return { repository: this.Repository, query: query };
	}

	/**
	 * Retorna todos os projetos de um usuário do banco de dados.
	 *
	 * @param {number} userId
	 * @returns {Page}
	 */
	@Paginate({ GROUP_BY: "projectId" })
	async getProjectsOfUser(userId) {
		/**
		 * @type {import("typeorm").FindManyOptions<Entity>}
		 */
		const query = {
			// Filtra pelo id do usuário.
			where: { userId: Like(`%${userId}%`) },

			// Adiciona a relação com o projeto.
			relations: { project: true },

			// Seleciona apenas os campos necessários.
			select: { project: { projectName: true, createdBy: true }, projectId: true, log: true },
		};

		return { repository: this.Repository, query: query };
	}

	async getRolesOfUserInProject(userId, projectId) {}

	async awardRoleToUserInProject(userId, projectId, role) {}

	async removeRoleFromUserInProject(userId, projectId, role) {}

	/**
	 * Insere um usuário como membro de um projeto no banco de dados.
	 *
	 * @param {ProjectsMembersDTO} projectsMembersDTO
	 * @returns {InsertResult}
	 */
	async addUserAsMemberOfProject(projectsMembersDTO) {
		return await this.Repository.createQueryBuilder("ProjectsMembers")
			.insert()
			.into("ProjectsMembers", ["projectId", "userId"])
			.values(projectsMembersDTO)
			.orIgnore()
			.execute();
	}

	/**
	 * Remove um usuário dos membros de um projeto no banco de dados.
	 *
	 * @param {ProjectsMembersDTO} projectsMembersDTO
	 * @returns {DeleteResult}
	 */
	async removeUserFromMembersOfProject(projectsMembersDTO) {
		return await this.Repository.createQueryBuilder("ProjectsMembers")
			.delete()
			.from("ProjectsMembers")
			.where("projectId = :projectId AND userId = :userId", {
				projectId: projectsMembersDTO.projectId,
				userId: projectsMembersDTO.userId,
			})
			.execute();
	}

	/**
	 * Indica se o usuário é membro do projeto no banco de dados.
	 *
	 * @param {ProjectsMembersDTO} projectsMembersDTO
	 * @returns {boolean}
	 */
	async isUserMemberOfProject(projectsMembersDTO) {
		const isMember = await this.Repository.createQueryBuilder("ProjectsMembers")
			.where("userId = :userId AND projectId = :projectId", {
				userId: projectsMembersDTO.userId,
				projectId: projectsMembersDTO.projectId,
			})
			.getOne();

		return isMember != null;
	}
}

module.exports = ProjectsMembersRepository;
