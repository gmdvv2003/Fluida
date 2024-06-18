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
			const { current, data, index } = getComponentDataFromRef(ref) || {};
			if (!current || !data || index === undefined) {
				return null;
			}

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
			const { uuid } = getAssociatedPlaceholder(current) || {};
			if (!uuid) {
				return null;
			}

			// Remove o placeholder associado ao elemento
			removePlaceholder(uuid);

			const { clientX, clientY } = event;

			// Novo índice de ordem do componente
			let newOrderIndex = getDropoffIndex(clientX, clientY) * 2;

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
			const { getReference } = getAssociatedPlaceholder(current) || {};
			if (!getReference) {
				onDragBegin(ref, null, null);
				return null;
			}

			const reference = getReference();
			if (!reference) {
				return null;
			}

			const { clientX, clientY } = event;

			// Novo índice de ordem do componente
			let newOrderIndex = getDropoffIndex(clientX, clientY, event) * 2;
			newOrderIndex += newOrderIndex >= getComponentOrderFromData(data) ? 1 : -1;

			// Atualiza a ordem do componente
			reference.style.order = newOrderIndex;
		}

		onDragBeginRef.current = onDragBegin;
		onDragEndRef.current = onDragEnd;
		onDragMoveRef.current = onDragMove;

		return () => {
			onDragBeginRef.current = null;
			onDragEndRef.current = null;
			onDragMoveRef.current = null;
		};
	}, [addPlaceholder, removePlaceholder, associatePlaceholder, onDragBeginRef, onDragEndRef, onDragMoveRef, onDragConcludedCallback]);

	return children;
}

export default DragableModalDropLocation;
