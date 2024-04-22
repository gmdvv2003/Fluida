const {
	EmailTypeValidator,
	NameInputTypeValidator,
	PasswordTypeValidator,
	PhoneNumberTypeValidator,
} = require("../../../../utilities/inputs-validators/InputValidator");

const { InvalidInputParameter } = require("../../../exceptions/repository-input-validator/Exceptions");

const INPUT_TYPES_VALIDATORS_MAP = {
	// Validadors de tipos de entrada complexos
	email: EmailTypeValidator,
	name: NameInputTypeValidator,
	password: PasswordTypeValidator,
	phone: PhoneNumberTypeValidator,

	// Validadors de tipos de entrada simples
	string: function (input, { length }) {
		return !length || input.length <= length;
	},
};

function Validate({ NAME, TYPE, VALIDATOR, ...OPTIONS }) {
	return (handler) =>
		async function (dto) {
			VALIDATOR = VALIDATOR || TYPE;

			// Verifica se existe um validador para o tipo de entrada
			if (!VALIDATOR in INPUT_TYPES_VALIDATORS_MAP) {
				throw new Error(`O validador para o tipo ${VALIDATOR} não foi encontrado.`);
			}

			// Verifica se o campo foi encontrado no DTO
			if (!NAME in dto) {
				throw new Error(`O campo ${NAME} não foi encontrado no DTO.`);
			}

			// Verifica se o tipo do campo é o esperado
			if (typeof dto[NAME] !== TYPE) {
				throw new Error(`O campo ${NAME} não é do tipo ${TYPE}.`);
			}

			if (!INPUT_TYPES_VALIDATORS_MAP[VALIDATOR](dto[NAME], OPTIONS)) {
				throw new InvalidInputParameter(NAME);
			}

			return await handler.apply(this, [dto]);
		};
}

module.exports = { Validate };
