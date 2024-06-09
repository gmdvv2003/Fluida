import { useEffect } from "react";

function DragableModalDropLocation({
	createPlaceholder,
	getComponentFromRef,
	getComponentOrderFromData,
	getComponentDataFromRef,
	getAssociatedPlaceholder,
	getDropoffIndex,
	addPlaceholder,
	removePlaceholder,
	associatePlaceholder,
	onDragBeginRef,
	onDragEndRef,
	onDragMoveRef,
	onDragConcludedCallback,
	children,
}) {
	useEffect(() => {
		/**
		 *
		 * @param {*} ref
		 * @param {*} _
		 * @param {*} event
		 */
		function onDragBegin(ref, _, event) {
			const { current, data, index } = getComponentDataFromRef(ref);
			associatePlaceholder(current, addPlaceholder(index, createPlaceholder, data));
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
			removePlaceholder(uuid);

			// Novo índice de ordem do componente
			let newOrderIndex = getDropoffIndex(event.clientX);
			newOrderIndex += newOrderIndex >= getComponentOrderFromData(data) || 0;

			if (onDragConcludedCallback && typeof onDragConcludedCallback === "function") {
				onDragConcludedCallback(data, newOrderIndex);
			}
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

			// Novo índice de ordem do componente
			let newOrderIndex = getDropoffIndex(clientX);
			newOrderIndex += newOrderIndex >= getComponentOrderFromData(data) || 0;

			// Atualiza a ordem do componente
			getReference().style.order = newOrderIndex;
		}

		onDragBeginRef.current = onDragBegin;
		onDragEndRef.current = onDragEnd;
		onDragMoveRef.current = onDragMove;

		return () => {
			onDragBeginRef.current = null;
			onDragEndRef.current = null;
			onDragMoveRef.current = null;
		};
	}, [
		addPlaceholder,
		removePlaceholder,
		associatePlaceholder,
		onDragBeginRef,
		onDragEndRef,
		onDragMoveRef,
		onDragConcludedCallback,
	]);

	return children;
}

export default DragableModalDropLocation;
