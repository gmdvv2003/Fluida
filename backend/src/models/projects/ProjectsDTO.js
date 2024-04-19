class ProjectsDTO {
	constructor(project) {
		this.projectId = null;
		this.projectName = null;
		this.createdBy = null;
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
