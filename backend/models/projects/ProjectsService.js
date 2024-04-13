const { v4 } = require("uuid");

const Service = require("../__types/Service");

const ProjectsDTO = require("./ProjectsDTO");
const ProjectsEntity = require("./ProjectsEntity");

const projects = [];

class ProjectsService extends Service {
	// ==================================== Métodos Privados ==================================== //
	isUserInProject(userId, projectId) {
		return projects.some((project) => project.userId === userId && project.projectId === projectId);
	}

	// ==================================== Métodos Abertos ==================================== //
	// ==================================== Métodos Seguros ==================================== //
	/**
	 * Criação de um novo projeto.
	 *
	 * @param {number} createdBy
	 * @param {string} projectName
	 * @returns Criação de um novo projeto para o usuário.
	 */
	createProjectAuthenticated(createdBy, projectName) {
		try {
			const project = new ProjectsEntity(v4(), createdBy, projectName);
			projects.push(project);
			return { success: true, project: project };
		} catch (error) {
			return { success: false, message: error.message };
		}
	}

	deleteProjectAuthenticated(userId, projectId) {}

	participateAuthenticated(userId, projectId) {
		if (!this.isUserInProject(userId, projectId)) {
			return { success: false, message: "Usuário não está no projeto." };
		}
	}

	// TODO: Mover a função abaixo para a classe ProjectMembersInterface
	/**
	 * Retorna projetos do usuário pelo ID
	 *
	 * @param {number} userId
	 * @returns DTO dos projetos do usuário
	 */
	getProjectsByUserId(userId) {
		const projectsUser = projects.filter((project) => project.userId === userId);
		const projectsUserDTO = projectsUser.map((project) => new ProjectsDTO(project));
		return projectsUserDTO;
	}
}

module.exports = ProjectsService;
