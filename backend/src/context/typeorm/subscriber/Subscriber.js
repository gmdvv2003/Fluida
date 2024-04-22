const Database = require("../../../database/Database");
const Repository = require("../../../models/__types/Repository");

const { EventSubscriber } = require("typeorm");

// Metodos que podem ser inscritos. (Pegos da interface EntitySubscriberInterface do Typeorm)
const LISTENERS = [
	"listenTo",
	"afterLoad",
	"beforeQuery",
	"afterQuery",
	"beforeInsert",
	"afterInsert",
	"beforeUpdate",
	"afterUpdate",
	"beforeRemove",
	"beforeSoftRemove",
	"beforeRecover",
	"afterRemove",
	"afterSoftRemove",
	"afterRecover",
	"beforeTransactionStart",
	"afterTransactionStart",
	"beforeTransactionCommit",
	"afterTransactionCommit",
	"beforeTransactionRollback",
	"afterTransactionRollback",
];

function getListenersRepository(listener) {
	return `${listener}%repository`;
}

/**
 * Inscreve a classe como subscriber de um evento.
 *
 * @param {string} dto
 * @param {Repository} target
 */
function Subscribe(dto, target) {
	const eventSubscriber = new EventSubscriber();

	// Evento que filtra as entidades que o subscriber irá escutar.
	eventSubscriber.listenTo = () => {
		return dto;
	};

	// Pega todos os métodos da classe.
	Object.getOwnPropertyNames(Object.getPrototypeOf(target)).forEach((method) => {
		// Verifica se o método é um listener.
		const listener = method.split("_")[0];
		if (LISTENERS.includes(listener)) {
			// Substitui o método original por um novo que executa os listeners.
			if (target[method] instanceof Function) {
				target[getListenersRepository(listener)] = [target[method]];
			} else {
				target[getListenersRepository(listener)].push(target[method]);
			}
		}
	});

	// Prepara os listeners para serem executados.
	LISTENERS.forEach((listener) => {
		const repository = target[getListenersRepository(listener)];
		if (repository) {
			eventSubscriber[listener] = (...data) => repository.forEach((callback) => callback.apply(target, data));
		}
	});

	// Adiciona os listeners as inscrições do banco de dados.
	Database.subscribers.push({ ...eventSubscriber });
}

module.exports = { Subscribe };
