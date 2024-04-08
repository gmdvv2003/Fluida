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

	constructor(path) {
		this.url = url.format({
			...OPTIONS,
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
	home: new Url("/home"),
	login: new Url("/login"),
	registration: new Url("/registration"),
	resetPassword: new Url("/reset-password"),
	sendPasswordReset: new Url("/send-password-reset"),
	validateEmail: new Url("/validate-email"),
};
