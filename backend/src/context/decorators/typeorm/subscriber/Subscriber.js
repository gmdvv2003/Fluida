const Database = require("../../../../database/Database");
const Repository = require("../../../../models/__types/Repository");

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

function renameListenerToIdentifier(listener) {
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
			// "Substitui" o método original por um novo que executa os listeners.
			if (target[renameListenerToIdentifier(listener)] == undefined) {
				target[renameListenerToIdentifier(listener)] = [target[method]];
			} else {
				target[renameListenerToIdentifier(listener)].splice(0, 0, target[method]);
			}
		}
	});

	// Prepara os listeners para serem executados.
	LISTENERS.forEach((listener) => {
		const repository = target[renameListenerToIdentifier(listener)];
		if (repository) {
			eventSubscriber[listener] = (...data) => {
				const execute = async (index) => {
					if (index >= repository.length) {
						return Promise.resolve();
					}

					repository[index].apply(target, data).finally(() => {
						execute(index + 1);
					});
				};

				execute(0);
			};
		}
	});

	// Adiciona os listeners as inscrições do banco de dados.
	Database.subscribers.push({ ...eventSubscriber });
}

function SubscribeOnce(runner, afterTriggers) {}

module.exports = { Subscribe };
