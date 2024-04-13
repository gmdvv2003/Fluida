module.exports = function (user, project, invitationUrl) {
	return {
		to: user.email,

		subject: "Convite de Projeto",
		text: "project-invitation",

		replacer: function () {
			return {
				Title: "Convite de Projeto",
				SubTitle: `Olá, ${user.firstName} ${user.lastName}`,
				Description: `Você foi convidado a participar do projeto ${project.projectName} no Fluida.\nPara aceitar o convite, clique no botão abaixo:`,
				Button: "Aceitar Convite",
				ButtonLink: `${invitationUrl}`,
				LeadingText:
					"O link do convite para o projeto ira expirar em 24 horas.\nSe não foi você quem realizou essa atividade, desconsidere essa mensagem.",
			};
		},

		template: "RequestedAction.html",
	};
};
