const PASSWORD_STRENGTH_VALIDATORS = {
	minLength: (length) => {
		return {
			isSatisfied: (password) => {
				return password.length >= length;
			},
			description: `At least ${length} characters`,
		};
	},

	requireLowerCase: () => {
		return {
			isSatisfied: (password) => {
				return password.match(/[a-z]/);
			},
			description: "At least one lowercase letter",
		};
	},

	requireUpperCase: () => {
		return {
			isSatisfied: (password) => {
				return password.match(/[A-Z]/);
			},
			description: "At least one uppercase letter",
		};
	},

	requireNumber: () => {
		return {
			isSatisfied: (password) => {
				return password.match(/[0-9]/);
			},
			description: "At least one number",
		};
	},

	requireSymbol: () => {
		return {
			isSatisfied: (password) => {
				return password.match(/[^a-zA-Z0-9]/);
			},
			description: "At least one symbol",
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
