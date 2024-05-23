function DragableModalDropLocation({
	createPlaceholder,
	getDropoffIndex,
	getComponentFromRef,
	getComponentDataFromRef,
	getAssociatedPlaceholder,
	addPlaceholder,
	removePlaceholder,
	associatePlaceholder,
	onDragBeginRef,
	onDragEndRef,
	onDragMoveRef,
	onDragConcludeCallback,
}) {
	/**
	 *
	 * @param {*} ref
	 * @param {*} _
	 * @param {*} event
	 */
	function onDragBegin(ref, _, event) {
		const { current, data, index } = getComponentDataFromRef(ref);
		lazyLoaderRef.current?.associatePlaceholder(
			current,
			lazyLoaderRef.current?.addPlaceholder(index, constructPhasePlaceholder, data?.phaseDTO)
		);
	}

	/**
	 *
	 * @param {*} ref
	 * @param {*} _
	 * @param {*} event
	 */
	function onDragEnd(ref, _, event) {
		// Pega o componente associado ao ref
		const { current, data } = getComponentDataFromRef(ref);

		// Pega o UUID do placeholder associado ao elemento
		const { uuid } = getAssociatedPlaceholder(current);

		// Remove o placeholder associado ao elemento
		lazyLoaderRef.current?.removePlaceholder(uuid);

		// Novo índice de ordem da fase
		let newOrderIndex = getNewPhaseOrderIndex(event.clientX);
		newOrderIndex += newOrderIndex >= data?.phaseDTO?.order ? 1 : 0;

		// Manda um evento para o servidor para mover a fase
		currentProjectSocket?.emit("movePhase", {
			phaseId: data?.phaseDTO?.phaseId,
			targetPositionIndex: newOrderIndex,
		});
	}

	/**
	 *
	 * @param {*} ref
	 * @param {*} _
	 * @param {*} event
	 */
	function onDragMove(ref, _, event) {
		// Pega o componente associado ao ref
		const { current, data } = getComponentDataFromRef(ref);

		// Pega o placeholder associado ao elemento
		const { getReference } = getAssociatedPlaceholder(current);

		const { clientX } = event;

		// Novo índice de ordem da fase
		let newOrderIndex = getNewPhaseOrderIndex(clientX);
		newOrderIndex += newOrderIndex >= data?.phaseDTO?.order ? 1 : 0;

		// Atualiza a ordem da fase
		getReference().style.order = newOrderIndex;
	}
}

export default DragableModalDropLocation;
