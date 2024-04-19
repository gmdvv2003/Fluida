class UsersDTO {
	constructor(user) {
		this.userId = null;
	}

	toEntity() {
		return {
			userId: this.userId,
		};
	}

	static fromEntity(entity) {
		return new UsersDTO(entity);
	}
}

module.exports = UsersDTO;
