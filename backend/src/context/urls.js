const url = require("url");

const OPTIONS = {};

if (process.env.NODE_ENVIRONMENT == "production") {
	OPTIONS.protocol = "https";
	OPTIONS.hostname = "www.fluida.com.br";
} else {
	OPTIONS.protocol = "http";
	OPTIONS.hostname = "localhost";
	OPTIONS.port = process.env.WEB_PORT;
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
	__origin_web: new Url({ port: process.env.WEB_PORT }),
	__origin_server: new Url({ port: process.env.SERVER_PORT }),
	home: new Url(null, "/home"),
	login: new Url(null, "/login"),
	registration: new Url(null, "/registration"),
	resetPassword: new Url(null, "/reset-password"),
	sendPasswordReset: new Url(null, "/send-password-reset"),
	validateEmail: new Url(null, "/validate-email"),
	valitateInvitation: new Url(null, "/validate-invitation"),
};
