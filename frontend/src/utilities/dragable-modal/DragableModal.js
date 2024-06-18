import React, { useState, useRef, useEffect } from "react";

import { useDragState, onComponentDragBegin, onComponentDragMove, onComponentDragEnd, DragableModalContext } from "./DragableModalContext";

const DragableModal = React.forwardRef(({ getChild, order, elements, callbacks, scrollableDivRef, isBeingDraggedExternalRef }, ref) => {
	const { _, useGlobalDragState } = useDragState();

	const [isDragging, setIsDragging] = useGlobalDragState("isDragging");
	const [currentComponentGettingDraggedUUID, __] = useGlobalDragState("currentComponentGettingDraggedUUID");

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	const [position, setPosition] = useState([0, 0]);

	const dragableDivRef = useRef(null);
	const dragableDivUUID = useRef(null);
	const dragableModalContextRef = useRef(null);

	function isDraggingThis() {
		return isDragging && currentComponentGettingDraggedUUID == dragableDivUUID;
	}

	useEffect(() => {
		const { x, y, width, height } = dragableDivRef.current.getBoundingClientRect();

		setWidth(width);
		setHeight(height);

		let pinOffsetX = 0;
		let pinOffsetY = 0;

		/**
		 *
		 * @param {*} value
		 */
		function setIsBeingDraggedExternalRefValue(value) {
			if (isBeingDraggedExternalRef != null) {
				setTimeout(() => {
					isBeingDraggedExternalRef.current = value;
				}, 0);
			}
		}

		/**
		 *
		 * @param {*} listener
		 * @returns
		 */
		function wrapExternalDragListener(listener) {
			return (event) => {
				listener(dragableDivRef, dragableDivUUID, event);
			};
		}

		/**
		 *
		 * @param {*} clientX
		 * @param {*} clientY
		 * @returns
		 */
		function getPositionWithOffset(clientX, clientY) {
			return [clientX + width / 2 - pinOffsetX, clientY + height / 2 - pinOffsetY];
		}

		/**
		 *
		 * @param {*} event
		 */
		function onDragBegin(event) {
			const { clientX, clientY } = event;

			pinOffsetX = clientX - x;
			pinOffsetY = clientY - y;

			setPosition(getPositionWithOffset(clientX, clientY));
		}

		/**
		 *
		 * @param {*} event
		 */
		function onDragEnd(event) {}

		/**
		 *
		 * @param {*} event
		 */
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

			onComponentDragBegin(() => setIsBeingDraggedExternalRefValue(true), dragableDivUUID.current),
			onComponentDragEnd(() => setIsBeingDraggedExternalRefValue(false), dragableDivUUID.current),
		];

		// Listeners externos
		"dragBegin" in callbacks &&
			callbacks.dragBegin.forEach((callback) =>
				listeners.push(dragableModalContextRef.current.onDragBegin(wrapExternalDragListener(callback)))
			);

		"dragEnd" in callbacks &&
			callbacks.dragEnd.forEach((callback) =>
				listeners.push(dragableModalContextRef.current.onDragEnd(wrapExternalDragListener(callback)))
			);

		"dragMove" in callbacks &&
			callbacks.dragMove.forEach((callback) =>
				listeners.push(dragableModalContextRef.current.onDragMove(wrapExternalDragListener(callback)))
			);

		return () => {
			listeners.forEach((remove) => remove());
		};
	}, [currentComponentGettingDraggedUUID]);

	return (
		<DragableModalContext getChild={getChild} modal={dragableDivRef} uuid={dragableDivUUID} ref={dragableModalContextRef}>
			{(() => {
				const isDraggingThisModal = isDraggingThis();

				// Offset do scroll em relação a tela
				const { scrollLeft, scrollTop } = scrollableDivRef.current;

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
										width: `${width}px`, // "100%",
										height: `${height}px`, // "100%",
										position: "absolute",
										left: position[0] + scrollLeft,
										top: position[1] + scrollTop,
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
