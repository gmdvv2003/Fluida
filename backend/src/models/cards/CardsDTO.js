class CardsDTO {
	constructor(card) {
		this.cardId = card?.cardId;
		this.phaseId = card?.phaseId;
		this.cardName = card?.cardName;
		this.cardDescription = card?.cardDescription || "";
		this.dueDate = card?.dueDate || "";
		this.creationDate = card?.creationDate;
		this.order = card?.order;
	}

	toEntity() {
		return {
			cardId: this.cardId,
			phaseId: this.phaseId,
			cardName: this.cardName,
			cardDescription: this.cardDescription,
			dueDate: this.dueDate,
			creationDate: this.creationDate,
			order: this.order,
		};
	}

	static fromEntity(entity) {
		return new CardsDTO(entity);
	}
}

module.exports = CardsDTO;
