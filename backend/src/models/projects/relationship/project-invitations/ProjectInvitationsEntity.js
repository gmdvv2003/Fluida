const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
	name: "ProjectInvitations",
	tableName: "ProjectInvitations",
});
