const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "ProjectMembers",

	// CREATE TABLE IF NOT EXISTS ProjectsMembers
	columns: {
		// project_id INT NOT NULL
		projectId: {
			nullable: false,
			type: "int",
		},

		// user_id VARCHAR(36) NOT NULL
		userId: {
			nullable: false,
			type: "varchar",
			length: 36,
		},
	},

	relations: {
		// FOREIGN KEY(projectId) REFERENCES Projects(projectId) ON DELETE CASCADE,
		project: {
			cascade: "remove",
			type: "many-to-one",
			target: "Projects",
			joinColumn: {
				name: "projectId",
			},
		},

		// FOREIGN KEY(userId) REFERENCES Users(userId) ON DELETE CASCADE,
		user: {
			cascade: "remove",
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
});
