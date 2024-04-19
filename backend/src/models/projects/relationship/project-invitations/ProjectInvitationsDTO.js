class ProjectInvitationsDTO {
	constructor(projectInvitation) {
		this.projectId = projectInvitation?.projectId;
		this.userId = projectInvitation?.userId;
	}

	toEntity() {
		return {
			projectId: this.projectId,
			userId: this.userId,
		};
	}

	static fromEntity(entity) {
		return new ProjectInvitationsDTO(entity);
	}
}

module.exports = ProjectInvitationsDTO;
