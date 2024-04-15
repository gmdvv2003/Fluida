const { v4 } = require("uuid");

const Service = require("../__types/Service");

const ProjectsDTO = require("./ProjectsDTO");
const ProjectsEntity = require("./ProjectsEntity");

const projects = [];

const projectsMembers = [];
const projectsInvitations = [];

class ProjectsService extends Service {
	// ==================================== Métodos Privados ==================================== //
	get Members() {
		return projectsMembers;
	}

	get Invitations() {
		return projectsInvitations;
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

	participateAuthenticated(userId, projectId) {}
}

module.exports = ProjectsService;
