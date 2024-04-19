function Paginate({ GROUP_BY, PAGE = 1, PAGE_SIZE = 10 }) {
	return function (handler) {
		return async function (...data) {
			const { query } = handler(...data);
			if (!query) {
				throw new Error("Métodos paginados devem retornar um objeto com a propriedade 'query'");
			}

			// Offset inicial para a paginação
			const skip = (PAGE - 1) * PAGE_SIZE;

			const [taken, total] = await query.groupBy(GROUP_BY).skip(skip).take(PAGE_SIZE).getRawAndEntities();
			return {
				taken: taken,
				total: total,
				hasNextPage: skip + PAGE_SIZE < total,
				PAGE: PAGE,
				PAGE_SIZE: PAGE_SIZE,
			};
		};
	};
}

module.exports = { Paginate };
