const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "ProjectMembers",
	tableName: "ProjectMembers",

	// CREATE TABLE IF NOT EXISTS ProjectsMembers
	columns: {
		// log INT AUTO_INCREMENT PRIMARY_KEY
		log: {
			primary: true,
			generated: "increment",
			type: "int",
		},

		// project_id INT NOT NULL
		projectId: {
			nullable: false,
			type: "int",
		},

		// user_id VARCHAR(36) NOT NULL
		userId: {
			nullable: false,
			type: "int",
		},
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

	target: require("./ProjectMembersDTO.js"),
});
