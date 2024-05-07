class CardsDTO {
	constructor(card) {
		this.cardId = card?.cardId;
		this.phaseId = card?.phaseId;
		this.cardTitle = card?.cardTitle;
		this.cardDescription = card?.cardDescription;
		this.cardDueDate = card?.cardDueDate;
		this.cardCreationDate = card?.cardCreationDate;
		this.order = card?.order;
	}

	toEntity() {
		return {
			cardId: this.cardId,
			phaseId: this.phaseId,
			cardTitle: this.cardTitle,
			cardDescription: this.cardDescription,
			cardDueDate: this.cardDueDate,
			cardCreationDate: this.cardCreationDate,
			order: this.order,
		};
	}

	static fromEntity(entity) {
		return new CardsDTO(entity);
	}
}

module.exports = CardsDTO;
