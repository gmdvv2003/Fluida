const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "ProjectsPhases",
	tableName: "ProjectsPhases",

	// CREATE TABLE IF NOT EXISTS ProjectsPhases
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

		// phaseId INT NOT NULL
		phaseId: {
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

		// FOREIGN KEY(phaseId) REFERENCES Phases(phaseId) ON DELETE CASCADE,
		phase: {
			onDelete: "CASCADE",
			type: "many-to-one",
			target: "Phases",
			joinColumn: {
				name: "phaseId",
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

		// INDEX phaseIdIndex(phaseId)
		{
			name: "phaseIdIndex",
			unique: false,
			columns: ["phaseId"],
		},
	],

	target: require("./ProjectsPhasesDTO"),
});
