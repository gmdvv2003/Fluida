const Route = require("./../../context/route/Route");
const SocketRoute = require("../../context/route/SocketRoute");

module.exports = function (app, io, usersController) {
	// ==================================== Rotas Publicas ==================================== //

	/**
	 * @swagger
	 * /users/register:
	 *   post:
	 *     summary: Criar conta
	 *     tags:
	 *       - Users
	 *     description: Permite criar uma conta, fornecendo seu e-mail, senha, telefone, nome e sobrenome.
	 *     requestBody:
	 *       description: Contém os dados necessários para criar uma nova conta de usuário.
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 description: E-mail do usuário
	 *               password:
	 *                 type: string
	 *                 description: Senha do usuário
	 *               phone:
	 *                 type: string
	 *                 description: Telefone do usuário
	 *               firstName:
	 *                 type: string
	 *                 description: Nome do usuário
	 *               lastName:
	 *                 type: string
	 *                 description: Sobrenome do usuário
	 *             required:
	 *               - email
	 *               - password
	 *               - phone
	 *               - firstName
	 *               - lastName
	 *     responses:
	 *       201:
	 *         description: Usuário criado com sucesso, retorna informações básicas do usuário.
	 *       400:
	 *         description: Requisição inválida.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.post(
		"/users/register",
		Route.newRoute({ secure: false }, usersController.register, usersController)
	);

	app.post(
		"/users/isEmailInUse",
		Route.newRoute({ secure: false }, usersController.isEmailInUse, usersController)
	);

	/**
	 * @swagger
	 * /users/login:
	 *   post:
	 *     summary: Autenticar usuário
	 *     tags:
	 *       - Users
	 *     description: Autêntica o usuário com base em seu e-mail e senha fornecidos.
	 *     requestBody:
	 *       description: Contém o e-mail e a senha do usuário para autenticação.
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 description: E-mail do usuário
	 *               password:
	 *                 type: string
	 *                 description: Senha do usuário
	 *             required:
	 *               - email
	 *               - password
	 *     responses:
	 *       200:
	 *         description: Usuário autenticado com sucesso, retorna um token de acesso.
	 *       400:
	 *         description: Requisição inválida.
	 *       401:
	 *         description: Credenciais inválidas.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.post(
		"/users/login",
		Route.newRoute({ secure: false }, usersController.login, usersController)
	);

	// ==================================== Rotas Seguras ==================================== //

	/**
	 * @swagger
	 * /users/logout:
	 *   post:
	 *     summary: Deslogar usuário
	 *     tags:
	 *       - Users
	 *     description: Encerra a sessão do usuário, invalidando o token de acesso.
	 *     responses:
	 *       200:
	 *         description: Usuário deslogado com sucesso.
	 *       401:
	 *         description: Não autorizado.
	 *       500:
	 *         description: Erro interno do servidor.
	 *     security:
	 *       - bearerAuth: []
	 */
	app.post(
		"/users/logout",
		Route.newRoute(
			{ secure: true },
			usersController.logoutAuthenticated,
			usersController,
			["userId"],
			usersController.Service.sessionValidator
		)
	);

	/**
	 * @swagger
	 * /users/alterSettings:
	 *   put:
	 *     summary: Alterar configurações
	 *     tags:
	 *       - Users
	 *     description: Permite adicionar uma foto para o usuário.
	 *     requestBody:
	 *       description: Contém a URL da foto que o usuário deseja adicionar.
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               photoUrl:
	 *                 type: string
	 *                 description: URL da nova foto do usuário
	 *             required:
	 *               - photoUrl
	 *     responses:
	 *       200:
	 *         description: Detalhes atualizados do usuário.
	 *       400:
	 *         description: Requisição inválida.
	 *       404:
	 *         description: Usuário não encontrado.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.put(
		"/users/alterSettings",
		Route.newRoute(
			{ secure: true },
			usersController.alterSettingsAuthenticated,
			usersController,
			["userId"],
			usersController.Service.sessionValidator
		)
	);

	// ==================================== Rotas Intermediárias ==================================== //
	// Validação do Email

	/**
	 * @swagger
	 * /users/validateEmail:
	 *   put:
	 *     summary: Validar e-mail
	 *     tags:
	 *       - Users
	 *     description: Permite ao usuário validar a sua conta utilizando-se do token recebido por e-mail.
	 *     requestBody:
	 *       description: Contém o token de validação de e-mail.
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               token:
	 *                 type: string
	 *                 description: Token recebido por e-mail para validação da conta
	 *             required:
	 *               - token
	 *     responses:
	 *       200:
	 *         description: Conta validada com sucesso.
	 *       400:
	 *         description: Requisição inválida.
	 *       404:
	 *         description: Usuário não encontrado.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.put(
		"/users/validateEmail",
		Route.newRoute({ secure: false }, usersController.validateEmail, usersController)
	);

	// Reset de Senha

	/**
	 * @swagger
	 * /users/requestPasswordReset:
	 *   put:
	 *     summary: Solicitar redefinição de senha
	 *     tags:
	 *       - Users
	 *     description: Inicia o processo de recuperação de senha, enviando um e-mail ao usuário com um link para redefinir sua senha.
	 *     requestBody:
	 *       description: Contém o e-mail do usuário que deseja redefinir a senha.
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 description: E-mail do usuário que deseja redefinir a senha
	 *             required:
	 *               - email
	 *     responses:
	 *       200:
	 *         description: Instruções de recuperação de senha enviadas com sucesso.
	 *       400:
	 *         description: Requisição inválida.
	 *       404:
	 *         description: Usuário não encontrado.
	 *       500:
	 *         description: Erro interno do servidor.
	 */
	app.put(
		"/users/requestPasswordReset",
		Route.newRoute({ secure: false }, usersController.requestPasswordReset, usersController)
	);

	/**
	 * @swagger
	 * /users/resetPassword:
	 *   put:
	 *     summary: Redefinir senha
	 *     tags:
	 *      - Users
	 *     parameters:
	 *       - in: query
	 *         name: userId
	 *         schema:
	 *           type: integer
	 *         required: true
	 *         description: Numeric ID of the user to reset the password for
	 *     requestBody:
	 *       description: Permite ao usuário redefinir sua senha usando o token recebido por e-mail.
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               token:
	 *                 type: string
	 *                 description: Token recebido por e-mail para redefinir a senha
	 *               newPassword:
	 *                 type: string
	 *                 description: Nova senha que o usuário deseja definir
	 *             required:
	 *               - token
	 *               - newPassword
	 *     responses:
	 *       200:
	 *         description: Senha redefinida com sucesso
	 *       400:
	 *         description: Requisição inválida
	 *       404:
	 *         description: Usuário não encontrado
	 *       500:
	 *         description: Erro interno do servidor
	 */
	app.put(
		"/users/resetPassword",
		Route.newRoute({ secure: false }, usersController.resetPassword, usersController)
	);

	// ==================================== Rotas do Socket ==================================== //
	const notificationsIO = io.of("/notifications");

	// Garante que o socket só será acessado por usuários com um token de acesso válido
	SocketRoute.newSecureSocketRoute(notificationsIO, usersController, ["userId"]);

	notificationsIO.on("connection", (socket) => {
		socket.on("notificationRead", (data) => {});
	});
};
