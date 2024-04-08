const PASSWORD_STRENGTH_VALIDATORS = {
	minLength: (length) => {
		return {
			isSatisfied: (password) => {
				return password.length >= length;
			},
			description: `Pelo menos ${length} caracteres.`,
		};
	},

	requireLowerCase: () => {
		return {
			isSatisfied: (password) => {
				return password.match(/[a-z]/);
			},
			description: "Pelo menos 1 caractere minúsculo.",
		};
	},

	requireUpperCase: () => {
		return {
			isSatisfied: (password) => {
				return password.match(/[A-Z]/);
			},
			description: "Pelo menos 1 caractere maiúsculo.",
		};
	},

	requireNumber: () => {
		return {
			isSatisfied: (password) => {
				return password.match(/[0-9]/);
			},
			description: "Pelo menos 1 número.",
		};
	},

	requireSymbol: () => {
		return {
			isSatisfied: (password) => {
				return password.match(/[^a-zA-Z0-9]/);
			},
			description: "Pelo menos 1 caractere especial.",
		};
	},
};

export default class PasswordStrengthValidador {
	#requiredParameters = [];

	constructor(passwordStrengthParameters) {
		Object.keys(passwordStrengthParameters).forEach((parameter) => {
			const value = passwordStrengthParameters[parameter];
			if (value) {
				this.#requiredParameters.push(PASSWORD_STRENGTH_VALIDATORS[parameter](value));
			}
		});
	}

	getParameters() {
		return this.#requiredParameters;
	}

	getStrength(password) {
		return 0;
	}
}
