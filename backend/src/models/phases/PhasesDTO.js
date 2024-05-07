class PhasesDTO {
	constructor(phase) {
		this.phaseId = phase?.phaseId;
		this.projectId = phase?.projectId;
		this.phaseName = phase?.phaseName;
		this.totalCards = phase?.totalCards;
		this.order = phase?.order;
	}

	toEntity() {
		return {
			phaseId: this.phaseId,
			projectId: this.projectId,
			phaseName: this.phaseName,
			totalCards: this.totalCards,
			order: this.order,
		};
	}

	static fromEntity(entity) {
		return new PhasesDTO(entity);
	}
}

module.exports = PhasesDTO;
