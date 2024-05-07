const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "Phases",
	tableName: "Phases",

	// CREATE TABLE IF NOT EXISTS Phases
	columns: {
		// phaseId INT NOT NULL AUTO_INCREMENT
		phaseId: {
			primary: true,
			generated: "increment",
			type: "int",
		},

		// projectId INT NOT NULL
		projectId: {
			nullable: false,
			type: "int",
		},

		// phaseName VARCHAR(100) NOT NULL
		phaseName: {
			nullable: false,
			type: "varchar",
			length: 100,
		},

		// totalCards INT DEFAULT 0
		totalCards: {
			type: "int",
			default: 0,
		},

		// order INT NOT NULL DEFAULT 0
		order: {
			nullable: false,
			type: "int",
			default: 0,
		},
	},

	relations: {
		// FOREIGN KEY(projectId) REFERENCES Projects(projectId) ON DELETE CASCADE,
		projectId: {
			onDelete: "CASCADE",
			type: "many-to-one",
			target: "Projects",
			joinColumn: {
				name: "projectId",
			},
		},
	},

	indices: [
		// CREATE INDEX phaseIdIndex ON Phases(phaseId);
		{
			name: "phaseIdIndex",
			unique: false,
			columns: ["phaseId"],
		},
	],

	target: require("./PhasesDTO"),
});
