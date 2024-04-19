const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "Users",
	tableName: "Users",

	// CREATE TABLE IF NOT EXISTS Users
	columns: {
		// userId INT NOT NULL UNIQUE
		userId: {
			primary: true,
			nullable: false,
			generated: "increment",
			type: "int",
		},

		// firstName VARCHAR(100) NOT NULL
		firstName: {
			type: "varchar",
			length: 100,
		},

		// lastName VARCHAR(100) NOT NULL
		lastName: {
			type: "varchar",
			length: 100,
		},

		// email VARCHAR(100) NOT NULL UNIQUE
		// (PRIMARY KEY(email))
		email: {
			unique: true,
			type: "varchar",
			length: 100,
		},

		// phoneNumber VARCHAR(20)
		phoneNumber: {
			type: "varchar",
			length: 20,
		},

		// password VARCHAR(255) NOT NULL
		password: {
			nullable: false,
			type: "varchar",
			length: 255,
		},

		// sessionToken VARCHAR(255)
		sessionToken: { type: "varchar", length: 255 },

		// emailValidationToken VARCHAR(255)
		emailValidationToken: { type: "varchar", length: 255 },

		// passwordResetToken VARCHAR(255)
		passwordResetToken: { type: "varchar", length: 255 },

		// emailVerified BOOLEAN DEFAULT FALSE
		emailVerified: { type: "boolean", default: false },
	},

	indices: [
		// CREATE INDEX userIdIndex ON Users(userId);
		{
			name: "userIdIndex",
			unique: false,
			columns: ["userId"],
		},
	],

	// DTO Model
	target: require("./UsersDTO"),
});
