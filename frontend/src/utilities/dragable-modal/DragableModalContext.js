import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useImperativeHandle } from "react";
import createContainer from "utilities/global-container/GlobalContainer";

// Estado inicial do contexto.
const initialState = {
	isDragging: false,
	currentComponentGettingDraggedUUID: null,

	onDragBegin: [],
	onDragEnd: [],
	onDragMove: [],
};

const { setGlobalState: setGlobalDragState, useGlobalState: useGlobalDragState } = createContainer(initialState);

function invokeListeners(listeners, target, ...data) {
	listeners.forEach((listener) => {
		if (listener.target == target.current) {
			listener.listener(...data);
		}
	});
}

function bindToListenerWrapper(key) {
	return function (listener, target) {
		setGlobalDragState(key, (previousListeners) => [...(previousListeners || []), { listener, target }]);
		return () => {
			setGlobalDragState(key, (previousListeners) => previousListeners?.filter((listener) => listener.listener == listener));
		};
	};
}

// Funções para adicionar listeners de drag a um componente.
export const onComponentDragBegin = bindToListenerWrapper("onDragBegin");
export const onComponentDragMove = bindToListenerWrapper("onDragMove");
export const onComponentDragEnd = bindToListenerWrapper("onDragEnd");

let currentMouseMoveEventHandler = null;
let currentMouseUpEventHandler = null;

document.addEventListener("mousemove", (event) => currentMouseMoveEventHandler && currentMouseMoveEventHandler(event));
document.addEventListener("mouseup", (event) => currentMouseUpEventHandler && currentMouseUpEventHandler(event));

// Deixa disponível o estado de drag para os componentes.
export const useDragState = () => {
	return { setGlobalDragState, useGlobalDragState };
};

// Contexto que permite arrastar um modal.
const DragableModalContext = React.forwardRef(({ getChild, uuid, modal, children }, ref) => {
	const [isDragging, setIsDragging] = useGlobalDragState("isDragging");
	const [__, setCurrentComponentGettingDraggedUUID] = useGlobalDragState("currentComponentGettingDraggedUUID");

	const [onDragBegin] = useGlobalDragState("onDragBegin");
	const [onDragEnd] = useGlobalDragState("onDragEnd");
	const [onDragMove] = useGlobalDragState("onDragMove");

	uuid.current = uuid.current || uuidv4();

	useImperativeHandle(
		ref,
		() => ({
			onDragBegin: (listener) => onComponentDragBegin(listener, uuid.current),
			onDragEnd: (listener) => onComponentDragEnd(listener, uuid.current),
			onDragMove: (listener) => onComponentDragMove(listener, uuid.current),
		}),
		[]
	);

	useEffect(() => {
		let wantsToDragLocal = false;
		let isDraggingLocal = false;

		/**
		 *
		 * @param {*} event
		 */
		function onMouseMove(event) {
			if (isDraggingLocal || isDragging) {
				invokeListeners(onDragMove, uuid, event);
				event.preventDefault();
			} else if (wantsToDragLocal) {
				wantsToDragLocal = false;
				isDraggingLocal = true;

				// Atualiza o estado de drag
				setIsDragging(true);
				setCurrentComponentGettingDraggedUUID(uuid);

				// Invoca os listeners de drag begin do elemento
				invokeListeners(onDragBegin, uuid, event);

				requestAnimationFrame(() => {
					invokeListeners(onDragMove, uuid, event);
				});

				event.preventDefault();
			}
		}

		/**
		 *
		 * @param {} event
		 */
		function onMouseUp(event) {
			if (isDraggingLocal || isDragging) {
				invokeListeners(onDragEnd, uuid, event);

				setIsDragging(false);
				setCurrentComponentGettingDraggedUUID(null);

				currentMouseMoveEventHandler = null;
				currentMouseUpEventHandler = null;

				event.preventDefault();
			}

			wantsToDragLocal = false;
			isDraggingLocal = false;
		}

		/**
		 *
		 * @param {*} event
		 * @returns
		 */
		function onMouseDown(event) {
			if (isDragging) {
				return null;
			}

			// Pega o elemento que foi clicado
			const { target } = event;

			// Verifica se o elemento clicado é o mesmo que o ref
			if ((getChild != undefined ? getChild(modal) : modal?.current?.children?.[0]) != target) {
				return null;
			}

			currentMouseMoveEventHandler = onMouseMove;
			currentMouseUpEventHandler = onMouseUp;

			wantsToDragLocal = true;
		}

		// Pega o elemento atual
		const { current } = modal;

		// Adiciona o listener de mouse down (que da início ao drag)
		current.addEventListener("mousedown", onMouseDown);

		return () => {
			current.removeEventListener("mousedown", onMouseDown);
		};
	});

	return children;
});

export { DragableModalContext };
