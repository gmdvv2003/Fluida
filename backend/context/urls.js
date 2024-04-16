const url = require("url");

const OPTIONS = {};

if (process.env.NODE_ENVIRONMENT == "production") {
	OPTIONS.protocol = "https";
	OPTIONS.hostname = "www.fluida.com.br";
} else {
	OPTIONS.protocol = "http";
	OPTIONS.hostname = "localhost";
}

class Url {
	url;
	path;

	constructor(options = [], path = null) {
		this.url = url.format({
			...OPTIONS,
			...options,
			pathname: path,
		});

		this.path = path;
	}

	edit(options) {
		return url.format({
			pathname: this.path,
			...OPTIONS,
			...options,
		});
	}
}

Url.prototype.toString = function () {
	return this.url.toString();
};

module.exports = {
	__origin_web: new Url((options = { port: process.env.WEB_PORT })),
	__origin_server: new Url((options = { port: process.env.SERVER_PORT })),
	home: new Url((path = "/home")),
	login: new Url((path = "/login")),
	registration: new Url((path = "/registration")),
	resetPassword: new Url((path = "/reset-password")),
	sendPasswordReset: new Url((path = "/send-password-reset")),
	validateEmail: new Url((path = "/validate-email")),
	valitateInvitation: new Url((path = "/validate-invitation")),
};
