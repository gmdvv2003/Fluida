const EnumReducer = require("../../utilities/enum-reducer/EnumReducer");

const RolePermissions = Object.freeze(
	EnumReducer.reduce({
		Comments: 0, // Permissão para comentar

		EditCard: 100, // Permissão para editar cartões
		MoveCard: 101, // Permissão para mover cartões
		DeleteCard: 102, // Permissão para deletar cartões

		MovePhase: 200, // Permissão para mover fases
		EditPhase: 201, // Permissão para editar fases
		DeletePhase: 202, // Permissão para deletar fases

		AddOrRemoveMember: 300, // Permissão para adicionar ou remover membros
	})
);

module.exports = { RolePermissions };
