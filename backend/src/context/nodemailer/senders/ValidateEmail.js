module.exports = function (user, validationUrl) {
	return {
		to: user.email,

		subject: "Confirmação da Conta",
		text: "email-verification",

		replacer: function () {
			return {
				Title: "Confirme sua Conta",
				SubTitle: `Bem-vindo(a) ao Fluida!`,
				Description: `Olá, ${user.firstName} ${user.lastName}\nEstamos felizes de tê-lo(a) em nossa plataforma. Para começar a explorar à sua jornado ao Fluida, por favor confirme o seu email abaixo.`,
				Button: "Validar Conta",
				ButtonLink: `${validationUrl}`,
				LeadingText: "Se não foi você quem realizou essa atividade, desconsidere essa mensagem.",
			};
		},

		template: "RequestedAction.html",
	};
};
