class PhasesDTO {
	constructor(phase) {
		this.phaseId = phase?.phaseId;
		this.projectId = phase?.projectId;
		this.phaseName = phase?.phaseName;
		this.isFinalPhase = phase?.isFinalPhase;
		this.canCreateCards = phase?.canCreateCards;
	}

	toEntity() {
		return {
			phaseId: this.phaseId,
			projectId: this.projectId,
			phaseName: this.phaseName,
			isFinalPhase: this.isFinalPhase,
			canCreateCards: this.canCreateCards,
		};
	}

	static fromEntity(entity) {
		return new PhasesDTO(entity);
	}
}

module.exports = PhasesDTO;
