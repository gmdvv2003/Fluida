const UserSettingsModule = require("../UserSettingsModule");

const { uploadUserProfileIcon } = require("../../../../../database/content/users-profile-icons/UsersProfileIcons");

function handleAlter(user, file) {
	console.log(user, file);
	return { success: true, message: "Foto alterada." };
}

class PhotoSettingModule extends UserSettingsModule {
	constructor(component) {
		super(handleAlter.bind(component));
	}
}

module.exports = PhotoSettingModule;
