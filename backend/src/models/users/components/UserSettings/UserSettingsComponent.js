const PhotoSettingModule = require("./modules/PhotoSettingModule");

class UserSettingsComponent {
	#settingsModules;

	controller;

	constructor(controller) {
		this.#settingsModules = {
			UserPhoto: new PhotoSettingModule(this),
		};

		this.controller = controller;
	}

	/**
	 * Realiza a alteração de configurações de um usuário
	 *
	 * @param {number} userId
	 * @param {Map} toAlter
	 * @returns Estrutura que diz se a ação foi bem sucedida ou não
	 */
	alterUserSettings(userId, toAlter) {
		const user = this.controller.getService().getUserById(userId);
		if (!user) {
			return { success: false, message: "Usuário não encontrado." };
		}

		// Itera aplicando as alterações necessárias sobre as configurações do usuário
		const altered = toAlter.map(({ type, value }) => {
			const settingModule = this.#settingsModules[type];
			if (!settingModule) {
				return { success: false, message: "Módulo de configuração não encontrado." };
			}

			// Usa o retorno da função settingHandler para definir o resultado
			return settingModule.settingHandler(user, value);
		});

		return { success: true, altered: altered };
	}
}

module.exports = UserSettingsComponent;
