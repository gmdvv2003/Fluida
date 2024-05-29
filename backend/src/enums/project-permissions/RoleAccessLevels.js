const EnumReducer = require("../../utilities/enum-reducer/EnumReducer");

const AccessLevels = Object.freeze(
	EnumReducer.reduce({
		Observer: 0, // Observador
		Participant: 10, // Participante
		Manager: 20, // Gerente
		Owner: 3, // Dono
	})
);

module.exports = { AccessLevels };
