const SocketRoute = require("../../context/route/SocketRoute");
const Route = require("../../context/route/Route");

module.exports = function (app, io, projectsController) {
	// ==================================== Rotas Publicas ==================================== //
	// ==================================== Rotas Seguras ==================================== //

	/**
	 * @swagger
	 * /projects/createProject:
	 *   post:
	 *     summary: Criar projeto
	 *     tags:
	 *       - Projects
	 *     description: Permite criar o projeto para o usuário.
	 *     requestBody:
	 *       description: Contém as informações necessárias para criar um novo projeto.
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               projectName:
	 *                 type: string
	 *                 description: Nome do projeto
	 *               description:
	 *                 type: string
	 *                 description: Descrição do projeto
	 *             required:
	 *               - projectName
	 *     responses:
	 *       201:
	 *         description: Projeto criado com sucesso, retorna informações básicas do projeto.
	 *       400:
	 *         description: Requisição inválida.
	 *       401:
	 *         description: Não autorizado.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.post(
		"/projects/createProject",
		Route.newRoute(
			{ secure: true },
			projectsController.createProjectAuthenticated,
			projectsController,
			["userId"],
			projectsController.getService("users").sessionValidator
		)
	);

	/**
	 * @swagger
	 * /projects/deleteProject/{projectId}:
	 *   delete:
	 *     summary: Deletar projeto
	 *     tags:
	 *       - Projects
	 *     description: Deleta o projeto com o ID fornecido.
	 *     parameters:
	 *       - in: path
	 *         name: projectId
	 *         schema:
	 *           type: string
	 *         required: true
	 *         description: ID do projeto a ser deletado
	 *     responses:
	 *       204:
	 *         description: Projeto deletado com sucesso, sem conteúdo no corpo da resposta.
	 *       400:
	 *         description: Requisição inválida.
	 *       401:
	 *         description: Não autorizado.
	 *       404:
	 *         description: Projeto não encontrado.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.delete(
		"/projects/deleteProject/:projectId",
		Route.newRoute(
			{ secure: true },
			projectsController.deleteProjectAuthenticated,
			projectsController,
			["userId"],
			projectsController.getService("users").sessionValidator
		)
	);

	/**
	 * @swagger
	 * /projects/participate:
	 *   post:
	 *     summary: Participar do projeto
	 *     tags:
	 *       - Projects
	 *     description: Permite ao usuário entrar no projeto.
	 *     requestBody:
	 *       description: Contém informações adicionais sobre a participação do usuário no projeto.
	 *       required: false
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               additionalInfo:
	 *                 type: string
	 *                 description: Informações adicionais sobre a participação do usuário
	 *     responses:
	 *       200:
	 *         description: Usuário entrou no projeto com sucesso, sem conteúdo no corpo da resposta.
	 *       400:
	 *         description: Requisição inválida.
	 *       401:
	 *         description: Não autorizado.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.post(
		"/projects/participate",
		Route.newRoute(
			{ secure: true },
			projectsController.participateAuthenticated,
			projectsController,
			["userId"],
			projectsController.getService("users").sessionValidator
		)
	);

	/**
	 * @swagger
	 * /projects/inviteMember:
	 *   post:
	 *     summary: Convidar membro
	 *     tags:
	 *       - Projects
	 *     description: Permite que o dono do projeto faça convites para usuários.
	 *     requestBody:
	 *       description: Contém as informações necessárias para enviar um convite a um usuário.
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               userId:
	 *                 type: string
	 *                 description: ID do usuário a ser convidado para o projeto
	 *               message:
	 *                 type: string
	 *                 description: Mensagem opcional para acompanhar o convite
	 *             required:
	 *               - userId
	 *     responses:
	 *       204:
	 *         description: Convite enviado com sucesso, sem conteúdo no corpo da resposta.
	 *       400:
	 *         description: Requisição inválida.
	 *       401:
	 *         description: Não autorizado.
	 *       404:
	 *         description: Usuário não encontrado.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.post(
		"/projects/inviteMember",
		Route.newRoute(
			{ secure: true },
			projectsController.inviteMemberAuthenticated,
			projectsController,
			["userId"],
			projectsController.getService("users").sessionValidator
		)
	);

	/**
	 * @swagger
	 * /projects/getProjectsOfUser:
	 *   get:
	 *     summary: Pegar projetos do usuário
	 *     tags:
	 *       - Projects
	 *     description: Permite ao usuário pegar todos os projetos que ele pertence.
	 *     parameters:
	 *       - in: query
	 *         name: userId
	 *         schema:
	 *           type: string
	 *         required: true
	 *         description: ID do usuário para o qual se deseja obter os projetos
	 *     responses:
	 *       200:
	 *         description: Projetos do usuário obtidos com sucesso, sem conteúdo no corpo da resposta.
	 *       400:
	 *         description: Requisição inválida.
	 *       401:
	 *         description: Não autorizado.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.get(
		"/projects/getProjectsOfUser",
		Route.newRoute(
			{ secure: true },
			projectsController.getProjectsOfUserAuthenticated,
			projectsController,
			["userId"],
			projectsController.getService("users").sessionValidator
		)
	);

	/**
	 * @swagger
	 * /projects/validateInvite:
	 *   put:
	 *     summary: Validar convite
	 *     tags:
	 *       - Projects
	 *     description: Faz a validação do convite de participação do projeto enviado ao usuário e após a validação o usuário é incluído no projeto.
	 *     requestBody:
	 *       description: Contém as informações necessárias para validar o convite de participação no projeto.
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               inviteId:
	 *                 type: string
	 *                 description: ID do convite a ser validado
	 *             required:
	 *               - inviteId
	 *     responses:
	 *       204:
	 *         description: Convite de participação validado com sucesso, sem conteúdo no corpo da resposta.
	 *       400:
	 *         description: Requisição inválida.
	 *       401:
	 *         description: Não autorizado.
	 *       404:
	 *         description: Convite não encontrado.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.put(
		"/projects/validateInvite",
		Route.newRoute(
			{ secure: true },
			projectsController.validateInviteAuthenticated,
			projectsController,
			["userId"],
			projectsController.getService("users").sessionValidator
		)
	);

	// ==================================== Rotas do Socket ==================================== //
	const projectsIO = io.of("/projects");

	// Garante que o socket só será acessado por usuários com um token de acesso válido
	SocketRoute.newSecureSocketRoute(projectsIO, projectsController, ["userId", "projectId"]);

	projectsIO.on("connection", (socket) => {
		// Função utilitária para linkar os métodos do controller com os eventos do socket
		function linkToMethod(method) {
			return (data, acknowledgement) => {
				projectsController.ProjectsFunctionalityInterface[method](
					projectsIO,
					socket,
					data,
					acknowledgement
				);
			};
		}

		socket.on("subscribeToProject", linkToMethod("IOSubscribeToProject"));
		socket.on("unsubscribeFromProject", linkToMethod("IOUnsubscribeFromProject"));

		// Rotas de manipulação de cards
		socket.on("createCard", linkToMethod("IOCreateCard"));
		socket.on("deleteCard", linkToMethod("IODeleteCard"));
		socket.on("updateCard", linkToMethod("IOUpdateCard"));
		socket.on("moveCard", linkToMethod("IOMoveCard"));
		socket.on("fetchCards", linkToMethod("IOFetchCards"));
		socket.on("getTotalCards", linkToMethod("IOGetTotalCards"));

		// Rotas de manipulação de fases
		socket.on("createPhase", linkToMethod("IOCreatePhase"));
		socket.on("deletePhase", linkToMethod("IODeletePhase"));
		socket.on("updatePhase", linkToMethod("IOUpdatePhase"));
		socket.on("movePhase", linkToMethod("IOMovePhase"));
		socket.on("fetchPhases", linkToMethod("IOFetchPhases"));
		socket.on("getTotalPhases", linkToMethod("IOGetTotalPhases"));

		// Rotas do chat
		socket.on("sendMessage", linkToMethod("IOSendMessage"));
		socket.on("deleteMessage", linkToMethod("IODeleteMessage"));
		socket.on("editMessage", linkToMethod("IOEditMessage"));
	});
};
