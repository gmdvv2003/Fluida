const Repository = require("../__types/Repository");

const ProjectsEntity = require("./ProjectsEntity");

class ProjectsRepository extends Repository {
	constructor(service) {
		super(service, ProjectsEntity);
	}

	getProjectById(projectId) {
		return this.createQueryBuilder("projects").where(`projects.projectId =:projectId`).getOne({ projectId });
	}
}

module.exports = ProjectsRepository;
