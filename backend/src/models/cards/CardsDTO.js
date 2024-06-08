class CardsDTO {
	constructor(card) {
		this.cardId = card?.cardId;
		this.phaseId = card?.phaseId;
		this.title = card?.title;
		this.description = card?.description || "";
		this.dueDate = card?.dueDate || "";
		this.creationDate = card?.creationDate;
		this.order = card?.order;
	}

	toEntity() {
		return {
			cardId: this.cardId,
			phaseId: this.phaseId,
			title: this.title,
			description: this.description,
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
