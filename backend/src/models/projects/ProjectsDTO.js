class ProjectsDTO {
	constructor(project) {
		this.projectId = project?.projectId;
		this.projectName = project?.projectName;
		this.createdBy = project?.createdBy;
	}

	toEntity() {
		return {
			projectId: this.projectId,
			projectName: this.projectName,
			createdBy: this.createdBy,
		};
	}

	static fromEntity(entity) {
		return new ProjectsDTO(entity);
	}
}

module.exports = ProjectsDTO;
