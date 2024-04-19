const { DataSource } = require("typeorm");

const { config } = require("dotenv");
const { resolve } = require("path");

config({ path: resolve(__dirname, "..", "..", ".env") });

const Database = new DataSource({
	type: "mysql",

	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,

	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME + "-" + process.env.NODE_ENVIRONMENT,

	// Somente para facilitar o desenvolvimento (>>> NUNCA UTILIZAR EM PRODUÇÃO <<<)
	synchronize: process.env.NODE_ENVIRONMENT == "development",
	dropSchema: process.env.NODE_ENVIRONMENT == "development",

	entities: [__dirname + "\\..\\models\\users\\UsersEntity.js", __dirname + "\\..\\models\\projects\\ProjectsEntity.js"],
	migrations: [__dirname + "\\..\\migrations\\*.js"],
});

Database.initialize()
	.catch((error) => {
		console.error(`Erro ao inicializar o banco de dados: ${error}`);
	});

module.exports = Database;
