class PhasesDTO {
	constructor(phase) {
		this.phaseId = phase?.phaseId;
		this.projectId = phase?.projectId;
		this.phaseName = phase?.phaseName;
	}

	toEntity() {
		return {
			phaseId: this.phaseId,
			projectId: this.projectId,
			phaseName: this.phaseName,
		};
	}

	static fromEntity(entity) {
		return new PhasesDTO(entity);
	}
}

module.exports = PhasesDTO;
