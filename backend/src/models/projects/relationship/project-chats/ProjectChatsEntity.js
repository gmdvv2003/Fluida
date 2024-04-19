class ProjectChatsEntity {
	constructor(projectId, sourceId, targetId, messageId, content, sentAt) {
		this.projectId = projectId;
		this.sourceId = sourceId;
		this.targetId = targetId;
		this.messageId = messageId;
		this.content = content;
		this.sentAt = sentAt;
	}
}

module.exports = ProjectChatsEntity;
