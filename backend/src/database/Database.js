require("reflect-metadata");

const { DataSource } = require("typeorm");

const { config } = require("dotenv");
const { resolve } = require("path");

config({ path: resolve(__dirname, "..", "..", ".env") });

// Caso DATABASE_SYNC = 1 e NODE_ENVIRONMENT == "development", então ativa a sincronização do banco de dados.
const doSync = process.env.DATABASE_SYNC == 1 && process.env.NODE_ENVIRONMENT == "development";

const Database = new DataSource({
	type: "mysql",

	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,

	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME + "-" + process.env.NODE_ENVIRONMENT,

	// Somente para facilitar o desenvolvimento (>>> NUNCA UTILIZAR EM PRODUÇÃO <<<)
	synchronize: doSync,
	dropSchema: doSync,

	logging: process.env.DATABASE_LOGGING == 1,

	entities: [
		// Usuários
		__dirname + "\\..\\models\\users\\UsersEntity.js",

		// Projetos
		__dirname + "\\..\\models\\projects\\ProjectsEntity.js",

		// Fases
		__dirname + "\\..\\models\\phases\\PhasesEntity.js",

		// Cards
		__dirname + "\\..\\models\\cards\\CardsEntity.js",

		// Relacionamentos do Projeto
		__dirname + "\\..\\models\\projects\\relationship\\projects-members\\ProjectsMembersEntity.js",
		__dirname + "\\..\\models\\projects\\relationship\\projects-phases\\ProjectsPhasesEntity.js",

		// (Não implementado ainda)
		// __dirname + "\\..\\models\\projects\\relationship\\projects-invitations\\ProjectsInvitationsEntity.js",
		// __dirname + "\\..\\models\\projects\\relationship\\projects-chats\\ProjectsChatsEntity.js",

		// Relacionamentos das Fases
		__dirname + "\\..\\models\\phases\\relationship\\phases-cards\\PhasesCardsEntity.js",

		// (Não implementado ainda)
		// Relacionamentos dos Cards
		// __dirname + "\\..\\models\\cards\\relationship\\cards-comments\\CardsComments.js",

		// (Não implementado ainda)
		// __dirname + "\\..\\models\\cards\\relationship\\cards-attachments\\CardsAttachments.js",
		// __dirname + "\\..\\models\\cards\\relationship\\cards-assignments\\CardsAssigments.js",
	],
	migrations: [__dirname + "\\..\\migrations\\*.js"],
});

module.exports = Database;
