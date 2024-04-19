const Repository = require("../../../__types/Repository");

const ProjectMembersEntity = require("./ProjectMembersEntity");

const { Paginate } = require("../../../../context/pagination/Pagination");

class ProjectMembersRepository extends Repository {
	constructor(service) {
		super(service, ProjectMembersEntity);
	}

	@Paginate({ GROUP_BY: "userId" })
	async getMembersOfProject(projectId) {}

	@Paginate({ GROUP_BY: "projectId" })
	async getProjectsOfUser(userId) {
		return {
			query: this.createQueryBuilder("projects")
				.leftJoinAndSelect("projects.Users", "user")
				.innerJoin("projects.ProjectMembers", "members")
				.where("members.userId = :userId", { userId }),
		};
	}
}

module.exports = ProjectMembersRepository;
