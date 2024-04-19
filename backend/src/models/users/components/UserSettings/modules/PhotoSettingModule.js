const UserSettingsModule = require("../UserSettingsModule");

function handleAlter(user, value) {
	return { success: true, message: "Foto alterada." };
}

class PhotoSettingModule extends UserSettingsModule {
	constructor(component) {
		super(handleAlter.bind(component));
	}
}

module.exports = PhotoSettingModule;
