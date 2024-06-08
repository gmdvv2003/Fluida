import React, { useState, useRef, useEffect } from "react";

import {
	useDragState,
	onComponentDragBegin,
	onComponentDragMove,
	onComponentDragEnd,
	DragableModalContext,
} from "./DragableModalContext";

const DragableModal = React.forwardRef(({ order, elements, callbacks }, ref) => {
	const { _, useGlobalDragState } = useDragState();

	const [isDragging, setIsDragging] = useGlobalDragState("isDragging");
	const [currentComponentGettingDraggedUUID, __] = useGlobalDragState("currentComponentGettingDraggedUUID");

	const [position, setPosition] = useState([0, 0]);

	const dragableDivRef = useRef(null);
	const dragableDivUUID = useRef(null);
	const dragableModalContextRef = useRef(null);

	function isDraggingThis() {
		return isDragging && currentComponentGettingDraggedUUID == dragableDivUUID;
	}

	useEffect(() => {
		const { x, y, width, height } = dragableDivRef.current.getBoundingClientRect();

		let pinOffsetX = 0;
		let pinOffsetY = 0;

		function wrapExternalDragListener(listener) {
			return (event) => {
				listener(dragableDivRef, dragableDivUUID, event);
			};
		}

		function getPositionWithOffset(clientX, clientY) {
			return [clientX + width / 2 - pinOffsetX, clientY + height / 2 - pinOffsetY];
		}

		function onDragBegin(event) {
			const { clientX, clientY } = event;

			pinOffsetX = clientX - x;
			pinOffsetY = clientY - y;

			setPosition(getPositionWithOffset(clientX, clientY));
		}

		function onDragEnd(event) {}

		function onDragMove(event) {
			const { clientX, clientY } = event;
			setPosition(getPositionWithOffset(clientX, clientY));
		}

		// Adiciona todos os listeners incluindo os externos
		const listeners = [
			// Listeners internos
			onComponentDragBegin(onDragBegin, dragableDivUUID.current),
			onComponentDragEnd(onDragEnd, dragableDivUUID.current),
			onComponentDragMove(onDragMove, dragableDivUUID.current),

			// Listeners externos
			"dragBegin" in callbacks
				? dragableModalContextRef.current.onDragBegin(wrapExternalDragListener(callbacks.dragBegin))
				: null,
			"dragEnd" in callbacks
				? dragableModalContextRef.current.onDragEnd(wrapExternalDragListener(callbacks.dragEnd))
				: null,
			"dragMove" in callbacks
				? dragableModalContextRef.current.onDragMove(wrapExternalDragListener(callbacks.dragMove))
				: null,
		];

		return () => {
			listeners.forEach((remove) => remove != null && remove());
		};
	}, [callbacks]);

	return (
		<DragableModalContext modal={dragableDivRef} uuid={dragableDivUUID} ref={dragableModalContextRef}>
			{(() => {
				const isDraggingThisModal = isDraggingThis();
				return (
					<div
						ref={dragableDivRef}
						style={{
							order: order,
							height: "100%",
							padding: "0",
							border: "0",
							...(isDraggingThisModal
								? {
										position: "absolute",
										left: position[0],
										top: position[1],
										transform: "translate(-50%, -50%)",
										zIndex: "1000",
								  }
								: {}),
						}}
					>
						{elements(isDraggingThisModal)}
					</div>
				);
			})()}
		</DragableModalContext>
	);
});

export default DragableModal;
