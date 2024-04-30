const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "Projects",
	tableName: "Projects",

	// CREATE TABLE IF NOT EXISTS Projects
	columns: {
		// projectId INT NOT NULL AUTO_INCREMENT
		projectId: {
			primary: true,
			generated: "increment",
			type: "int",
		},

		// projectName VARCHAR(100) NOT NULL
		projectName: {
			nullable: false,
			type: "varchar",
			length: 100,
		},

		// createdBy VARCHAR(36) NOT NULL
		createdBy: {
			nullable: false,
			type: "int",
		},

		totalPhases: {
			type: "int",
			default: 0,
		},
	},

	relations: {
		// FOREIGN KEY(createdBy) REFERENCES Users(userId) ON DELETE CASCADE,
		createdBy: {
			onDelete: "CASCADE",
			type: "many-to-one",
			target: "Users",
			joinColumn: {
				name: "createdBy",
			},
		},
	},

	indices: [
		// CREATE INDEX projectIndex ON Projects(projectId);
		{
			name: "projectIdIndex",
			unique: false,
			columns: ["projectId"],
		},
	],

	target: require("./ProjectsDTO"),
});
