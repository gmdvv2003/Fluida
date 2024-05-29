function Reduce(enumerator, reduced = {}) {
	let smallestIndex = 0;

	for (let key in enumerator) {
		reduced[key] = smallestIndex++;
	}

	return reduced;
}

export default Reduce;
