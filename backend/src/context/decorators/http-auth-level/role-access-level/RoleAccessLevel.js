const { LowAccessLevel } = require("../../../exceptions/http-auth-level/role-access-level/Exception");

/**
 * Valida se o usuário possui o nível de acesso necessário para executar a ação.
 */
function HasAccess(ACCESS_LEVEL_GETTER, { REQUIRED_ACCESS_LEVEL }) {
	return (handler) => {
		return (...data) => {
			if (ACCESS_LEVEL_GETTER() < REQUIRED_ACCESS_LEVEL) {
				throw new LowAccessLevel();
			}

			return handler.apply(this, data);
		};
	};
}

module.exports = { HasAccess };
