const RolePermissions = require("../../../../enums/project-permissions/RolePermissions");
const Bitmask = require("../../../../utilities/bitmask/Bitmask");

const { NoPermissionGranted } = require("../../../exceptions/http-auth-level/role-permission/Exception");

/**
 * Valida se o usuário possui as permissões necessárias para executar a ação.
 */
function HasPermission(PERMISSIONS_GETTER, { REQUIRED_PERMISSIONS }) {
	return (handler) => {
		const requiredPermissions = Bitmask.fromBits(REQUIRED_PERMISSIONS);
		return (...data) => {
			const bitmask = Bitmask.fromBits(PERMISSIONS_GETTER());
			if (!bitmask.contains(requiredPermissions)) {
				throw new NoPermissionGranted();
			}

			return handler.apply(this, data);
		};
	};
}

module.exports = { HasPermission };
