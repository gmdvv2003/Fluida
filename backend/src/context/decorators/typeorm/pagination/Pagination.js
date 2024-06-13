const DEFAULT_PAGE_SIZE = 100;

class Page {
	constructor({ taken, total, page, pageSize, hasNextPage, retrieveNextPage }) {
		this.taken = taken;
		this.total = total;
		this.page = page;
		this.pageSize = pageSize;
		this.hasNextPage = hasNextPage;
		this.retrieveNextPage = retrieveNextPage;
	}

	/**
	 * Retorna a próxima página.
	 *
	 * @returns {Page}
	 */
	retrieveNextPage() {}
}

/**
 * Função utilizada para encapsular a paginação de um método.
 * Método deve retornar um objeto com a propriedade 'query' e 'repository'.
 *
 * @param {string} GROUP_BY
 * @param {number} PAGE
 * @param {number} PAGE_SIZE
 */
function Paginate({ GROUP_BY }) {
	return (handler, descriptor) =>
		async function (options, data) {
			let { PAGE, PAGE_SIZE } = options || { PAGE: 1, PAGE_SIZE: DEFAULT_PAGE_SIZE };

			PAGE = PAGE || 1;
			PAGE_SIZE = PAGE_SIZE || DEFAULT_PAGE_SIZE;

			const { repository, query, pick } = await handler.apply(this, [data]);
			if (!query) {
				throw new Error("Métodos paginados devem retornar um objeto com a propriedade 'query'");
			}

			// Adiciona os valores de paginação ao objeto de query.
			query.skip = (PAGE - 1) * PAGE_SIZE;
			query.take = PAGE_SIZE;
			query.order = { [GROUP_BY]: "ASC" };

			// Realiza a busca no banco de dados.
			let [taken, total] = await repository.findAndCount(query);

			if (pick != undefined) {
				taken = taken.map((item) => item[pick]);
			}

			// Verifica se existe uma próxima página.
			const hasNextPage = total > PAGE * PAGE_SIZE;

			return new Page({
				taken: taken,

				total: total,
				page: PAGE,
				pageSize: PAGE_SIZE,
				hasNextPage: hasNextPage,

				// Caso tenha uma próxima página, retorna uma função para pegar a próxima página.
				retrieveNextPage: hasNextPage
					? () => {
							return Paginate({ GROUP_BY })(handler, descriptor)({ PAGE: PAGE + 1, PAGE_SIZE }, ...data);
					  }
					: null,
			});
		};
}

module.exports = { Page, Paginate, DEFAULT_PAGE_SIZE };
