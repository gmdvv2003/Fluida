const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "Cards",
	tableName: "Cards",

	// CREATE TABLE IF NOT EXISTS Cards
	columns: {
		// cardId INT NOT NULL AUTO_INCREMENT
		cardId: {
			primary: true,
			generated: "increment",
			type: "int",
		},

		// phaseId INT NOT NULL
		phaseId: {
			nullable: false,
			type: "int",
		},

		// title VARCHAR(100) NOT NULL
		title: {
			nullable: false,
			type: "varchar",
			length: 100,
		},

		// description VARCHAR(2000) NOT NULL
		description: {
			nullable: false,
			type: "varchar",
			length: 2000,
		},

		// dueDate DATETIME
		dueDate: {
			nullable: true,
			type: "datetime",
		},

		// creationDate DATETIME DEFAULT CURRENT_TIMESTAMP
		creationDate: {
			default: "CURRENT_TIMESTAMP",
			nullable: false,
			type: "datetime",
		},
	},

	relations: {
		// FOREIGN KEY(phaseId) REFERENCES Phases(phaseId) ON DELETE CASCADE,
		phaseId: {
			onDelete: "CASCADE",
			type: "many-to-one",
			target: "Phases",
			joinColumn: {
				name: "phaseId",
			},
		},
	},

	indices: [
		// CREATE INDEX cardIdIndex ON Cards(cardId);
		{
			name: "cardIdIndex",
			unique: false,
			columns: ["cardId"],
		},
	],

	target: require("./CardsDTO"),
});
