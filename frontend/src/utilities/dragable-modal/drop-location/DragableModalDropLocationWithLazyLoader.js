import { useEffect, useState } from "react";

import DragableModalDropLocation from "./DragableModalDropLocation";

function DragableModalDropLocationWithLazyLoader({
	scrollableDivRef,
	lazyLoaderRef,
	createPlaceholder,
	getComponentFromRef,
	getComponentOrderFromData,
	dragBeginRef,
	dragEndRef,
	dragMoveRef,
	dragConcludedCallback,
	children,
}) {
	const [addPlaceholder, setAddPlaceholder] = useState(null);
	const [removePlaceholder, setRemovePlaceholder] = useState(null);
	const [associatePlaceholder, setAssociatePlaceholder] = useState(null);

	/**
	 *
	 * @param {*} ref
	 * @returns
	 */
	function getComponentDataFromRef(ref) {
		return lazyLoaderRef.current?.getComponentDataFromRef(getComponentFromRef(ref));
	}

	/**
	 *
	 * @param {*} ref
	 * @returns
	 */
	function getAssociatedPlaceholder(ref) {
		return lazyLoaderRef.current?.getAssociatedPlaceholder(ref);
	}

	/**
	 *
	 * @param {*} clientX
	 * @param {*} clientY
	 * @returns
	 */
	function getDropoffIndex(clientX, clientY, v) {
		const { width, height, margin, padding, direction } = lazyLoaderRef.current?.settings;

		// Pega os offsets relativos do scrollableDiv a tela
		const { x, y } = scrollableDivRef.current?.getBoundingClientRect();

		switch (direction) {
			case "horizontal":
				return Math.max(0, Math.floor((clientX - margin) / (width + padding)));

			case "vertical":
				return Math.max(0, Math.floor((clientY - margin) / (height + padding)));

			default:
				break;
		}
	}

	useEffect(() => {
		setAddPlaceholder(() => lazyLoaderRef.current?.addPlaceholder);
		setRemovePlaceholder(() => lazyLoaderRef.current?.removePlaceholder);
		setAssociatePlaceholder(() => lazyLoaderRef.current?.associatePlaceholder);
	}, [lazyLoaderRef]);

	return (
		<DragableModalDropLocation
			createPlaceholder={createPlaceholder}
			getComponentOrderFromData={getComponentOrderFromData}
			getComponentFromRef={getComponentFromRef}
			getComponentDataFromRef={getComponentDataFromRef}
			getAssociatedPlaceholder={getAssociatedPlaceholder}
			getDropoffIndex={getDropoffIndex}
			addPlaceholder={addPlaceholder}
			removePlaceholder={removePlaceholder}
			associatePlaceholder={associatePlaceholder}
			onDragBeginRef={dragBeginRef}
			onDragEndRef={dragEndRef}
			onDragMoveRef={dragMoveRef}
			onDragConcludedCallback={dragConcludedCallback}
		>
			{children}
		</DragableModalDropLocation>
	);
}

export default DragableModalDropLocationWithLazyLoader;
