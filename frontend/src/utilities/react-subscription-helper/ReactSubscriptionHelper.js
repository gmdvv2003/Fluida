class Subscription {
	callback;

	constructor(callback) {
		this.callback = callback;
	}

	notify(...pass) {
		this.callback(...pass);
	}
}

class ReactSubscriptionHelper {
	subscriptions = [];

	subscribe = (callback) => {
		const subscription = new Subscription(callback);
		this.subscriptions.push(subscription);

		return () => {
			const index = this.subscriptions.indexOf(subscription);
			this.subscriptions.splice(index, 1);
		};
	};

	notify(...pass) {
		this.subscriptions.forEach((subscription) => {
			subscription.notify(...pass);
		});
	}

	remove(callback) {
		const index = this.subscriptions.indexOf(callback);
		this.subscriptions.splice(index, 1);
	}

	getSubscriptions() {
		return this.subscriptions;
	}

	beGone() {
		delete this.subscriptions;
	}
}

export default ReactSubscriptionHelper;
