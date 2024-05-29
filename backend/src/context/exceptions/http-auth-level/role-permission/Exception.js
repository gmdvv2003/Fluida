class NoPermissionGranted extends Error {
	constructor(message) {
		super(message);
	}
}

module.exports = { NoPermissionGranted };
