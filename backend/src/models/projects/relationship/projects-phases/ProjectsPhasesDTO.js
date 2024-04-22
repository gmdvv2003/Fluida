class ProjectsPhasesDTO {
	constructor(projectsPhases) {
		this.projectId = projectsPhases?.projectId;
		this.phaseId = projectsPhases?.phaseId;
	}

	toEntity() {
		return {
			projectId: this.projectId,
			phaseId: this.phaseId,
		};
	}

	static fromEntity(entity) {
		return new ProjectsPhasesDTO(entity);
	}
}

module.exports = ProjectsPhasesDTO;
