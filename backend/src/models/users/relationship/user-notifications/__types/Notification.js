const NotificationMetadata = require("./NotificationMetadata");

class Notification {
	/**
	 * @param {number} userId
	 * @param {number} notificationId
	 * @param {NotificationMetadata} notificationMetadata
	 */
	constructor(userId, notificationId, notificationMetadata) {
		this.userId = userId;
		this.notificationId = notificationId;
		this.metadata = notificationMetadata;
	}
}

module.exports = Notification;
