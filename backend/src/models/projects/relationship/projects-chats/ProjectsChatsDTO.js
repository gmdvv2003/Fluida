class ProjectsChatsDTO {
	constructor(projectChat) {
		this.projectId = projectChat?.projectId;
		this.sourceId = projectChat?.sourceId;
		this.targetId = projectChat?.targetId;
		this.messageId = projectChat?.messageId;
		this.content = projectChat?.content;
		this.sentAt = projectChat?.sentAt;
	}

	toEntity() {
		return {
			projectId: this.projectId,
			sourceId: this.sourceId,
			targetId: this.targetId,
			messageId: this.messageId,
			content: this.content,
			sentAt: this.sentAt,
		};
	}

	static fromEntity(entity) {
		return new ProjectsChatsDTO(entity);
	}
}

module.exports = ProjectsChatsDTO;
