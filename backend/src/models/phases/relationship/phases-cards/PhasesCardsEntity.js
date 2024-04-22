const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "PhasesCards",
	tableName: "PhasesCards",

	// CREATE TABLE IF NOT EXISTS PhasesCards
	columns: {
		// (Chave sem utilização mas é obrigatória para o TypeORM)
		// log INT AUTO_INCREMENT PRIMARY_KEY
		log: {
			primary: true,
			generated: "increment",
			type: "int",
		},

		// phaseId INT NOT NULL
		phaseId: {
			nullable: false,
			type: "int",
		},

		// cardId INT NOT NULL
		cardId: {
			nullable: false,
			type: "int",
		},
	},

	relations: {
		// FOREIGN KEY(phaseId) REFERENCES Phases(phaseId) ON DELETE CASCADE,
		phase: {
			onDelete: "CASCADE",
			type: "many-to-one",
			target: "Phases",
			joinColumn: {
				name: "phaseId",
			},
		},

		// FOREIGN KEY(cardId) REFERENCES Cards(cardId) ON DELETE CASCADE,
		card: {
			onDelete: "CASCADE",
			type: "many-to-one",
			target: "Cards",
			joinColumn: {
				name: "cardId",
			},
		},
	},

	indices: [
		// INDEX phaseIdIndex(projectId)
		{
			name: "phaseIdIndex",
			unique: false,
			columns: ["phaseId"],
		},

		// INDEX cardIdINdex(cardId)
		{
			name: "cardIdIndex",
			unique: false,
			columns: ["cardId"],
		},
	],

	target: require("./PhasesCardsDTO"),
});
