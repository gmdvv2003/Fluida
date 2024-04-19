class ProjectMembersDTO {
	constructor(project) {
		this.projectId = project?.projectId;
		this.userId = project?.userId;
	}

	toEntity() {
		return {
			projectId: this.projectId,
			userId: this.userId,
		};
	}

	static fromEntity(entity) {
		return new ProjectMembersDTO(entity);
	}
}

module.exports = ProjectMembersDTO;
