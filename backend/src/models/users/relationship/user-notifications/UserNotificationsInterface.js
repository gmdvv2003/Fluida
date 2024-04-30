/**
 * userId: number
 * notificationId: number
 * metadata: map > {
 *  type: number
 *  content: map...
 * }
 */

const Notification = require("./__types/Notification.js");
const NotificationMetadata = require("./__types/NotificationMetadata.js");

const UserNotificationsDTO = require("./UserNotificationsDTO");
const UserNotificationsEntity = require("./UserNotificationsEntity");

class UserNotificationsInterface {
	Controller;

	constructor(controller) {
		this.Controller = controller;
	}

	/**
	 * Adiciona uma nova notificação para um usuário
	 *
	 * @param {number} userId
	 * @param {NotificationMetadata} metadata
	 */
	addNotification(userId, metadata) {}

	/**
	 * Realiza a remoção de uma notificação de um usuário
	 *
	 * @param {number} userId
	 * @param {number} notificationId
	 */
	removeNotification(userId, notificationId) {}

	/**
	 * Pega as notificações de um usuário
	 *
	 * @param {number} userId
	 * @returns {UserNotificationsDTO[]}
	 */
	getNotificationsOfUser(userId) {
		const notifications = this.Controller.Service.Notifications.filter((notification) => {
			return notification.userId === userId;
		});

		return notifications.map((notification) => {
			return new UserNotificationsDTO(notification);
		});
	}

	/**
	 * Pega as notificações de um usuário como objeto
	 *
	 * @param {number} userId
	 * @returns {Notification[]}
	 */
	getNotificationsOfUserAsObject(userId) {
		return this.getNotificationsOfUser(userId).map((notification) => {
			const { userId, notificationId, metadata } = notification;
			return new Notification(
				userId,
				notificationId,
				NotificationMetadata.newFromJson(metadata)
			);
		});
	}
}

module.exports = UserNotificationsInterface;
