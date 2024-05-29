const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "ProjectsMembers",
	tableName: "ProjectsMembers",

	// CREATE TABLE IF NOT EXISTS ProjectsMembers
	columns: {
		// (Chave sem utilização mas é obrigatória para o TypeORM)
		// log INT AUTO_INCREMENT PRIMARY_KEY
		log: {
			primary: true,
			generated: "increment",
			type: "int",
		},

		// projectId INT NOT NULL
		projectId: {
			nullable: false,
			type: "int",
		},

		// userId int NOT NULL
		userId: {
			nullable: false,
			type: "int",
		},

		// roles BIT(4) NOT NULL DEFAULT B'0000'
		// roles: {
		// 	nullable: false,
		// 	type: "bit",
		// 	length: 4,
		// 	default: "B'0000'",
		// },
	},

	relations: {
		// FOREIGN KEY(projectId) REFERENCES Projects(projectId) ON DELETE CASCADE,
		project: {
			onDelete: "CASCADE",
			type: "many-to-one",
			target: "Projects",
			joinColumn: {
				name: "projectId",
			},
		},

		// FOREIGN KEY(userId) REFERENCES Users(userId) ON DELETE CASCADE,
		user: {
			onDelete: "CASCADE",
			type: "many-to-one",
			target: "Users",
			joinColumn: {
				name: "userId",
			},
		},
	},

	indices: [
		// INDEX projectIdIndex(projectId)
		{
			name: "projectIdIndex",
			unique: false,
			columns: ["projectId"],
		},

		// INDEX userIdIndex(userId)
		{
			name: "userIdIndex",
			unique: false,
			columns: ["userId"],
		},
	],

	target: require("./ProjectsMembersDTO"),
});
