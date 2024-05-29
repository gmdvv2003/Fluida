class ProjectsMembersDTO {
	constructor(project) {
		this.projectId = project?.projectId;
		this.userId = project?.userId;
		// this.roles = project?.roles;
	}

	toEntity() {
		return {
			projectId: this.projectId,
			userId: this.userId,
			// roles: this.roles,
		};
	}

	static fromEntity(entity) {
		return new ProjectsMembersDTO(entity);
	}
}

module.exports = ProjectsMembersDTO;
