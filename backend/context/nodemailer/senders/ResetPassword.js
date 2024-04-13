module.exports = function (user, resetUrl) {
	return {
		to: user.email,

		subject: "Redefinição de Senha",
		text: "reset-password",

		replacer: function () {
			return {
				Title: "Redefinição de Senha",
				SubTitle: `Olá, ${user.firstName} ${user.lastName}`,
				Description:
					"Uma solicitação de redefinição de senha foi enviada para esta conta.\nPara redefinir a sua senha, clique no botão abaixo:",
				Button: "Redefinir Senha",
				ButtonLink: `${resetUrl}`,
				LeadingText:
					"O link de redefinição de senha ira expirar em 1 hora.\nSe não foi você quem realizou essa atividade, desconsidere essa mensagem.",
			};
		},

		template: "RequestedAction.html",
	};
};
