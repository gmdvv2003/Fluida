const fileSystem = require("fs");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

const EMAIL_SENDERS = {
	ResetPassword: "./senders/ResetPassword",
	ValidateEmail: "./senders/ValidateEmail",
};

// Prepara o transporte de emails pelo servidor SMTP
const TRANSPORTER = nodemailer.createTransport({
	host: process.env.EMAIL_SERVICE_HOST,
	port: process.env.EMAIL_SERVICE_PASSWORD,
	auth: {
		user: process.env.EMAIL_SERVICE_ADDRESS,
		pass: process.env.EMAIL_SERVICE_PASSWORD,
	},
});

/**
 * Lê o conteudo de um arquivo HTML e retorna o mesmo
 *
 * @param {string} path
 * @param {Function} callback
 * @returns Conteudo do arquivo HTML
 */
function readHTMLTemplateFile(path, callback) {
	return fileSystem.readFile(path, { encoding: "utf-8" }, function (error, html) {
		if (error) {
			callback(error);
		} else {
			callback(null, html);
		}
	});
}

class EmailTransporter {
	/**
	 * Envia um email para o destinatário especificado pelo sender
	 *
	 * @param {string} sender
	 * @param  {...any} data
	 * @returns Promise com o resultado do envio
	 */
	static send(sender, ...data) {
		if (!EMAIL_SENDERS[sender]) {
			throw new Error("Invalid email sender type.");
		}

		const { to, subject, text, replacer, template } = require(`${EMAIL_SENDERS[sender]}.js`)(...data);

		return new Promise((resolve, reject) => {
			readHTMLTemplateFile(__dirname + `\\senders\\templates\\${template}`, async function (error, html) {
				if (error) {
					return reject(error);
				}

				// Prepara as opções de envio do email
				const mailOptions = {
					from: process.env.EMAIL_ADDRESS,
					to: to,
					subject: subject,
					text: text,

					// Substitui as variáveis do template pelo valor correto
					html: handlebars.compile(html)(replacer()),
				};

				// Envia o email e espera por uma resposta
				resolve(await TRANSPORTER.sendMail(mailOptions));
			});
		});
	}
}

module.exports = EmailTransporter;
