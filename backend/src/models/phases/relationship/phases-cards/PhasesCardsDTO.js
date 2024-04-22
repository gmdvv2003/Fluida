class PhasesCardsDTO {
	constructor(phasesCards) {
		this.phaseId = phasesCards?.phaseId;
		this.cardId = phasesCards?.cardId;
	}

	toEntity() {
		return {
			phaseId: this.phaseId,
			cardId: this.cardId,
		};
	}

	static fromEntity(entity) {
		return new PhasesCardsDTO(entity);
	}
}

module.exports = PhasesCardsDTO;
