class UserNotificationsDTO {
	constructor({ notificationId, userId, metadata }) {
		this.notificationId = notificationId;
		this.userId = userId;
		this.metadata = metadata;
	}
}

module.exports = UserNotificationsDTO;
