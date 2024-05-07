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

const { setGlobalState: setGlobalDragState, useGlobalState: useGlobalDragState } =
	createContainer(initialState);

function invokeListeners(listeners, target, ...data) {
	listeners.forEach((listener) => {
		if (listener.target == target.current) {
			listener.listener(...data);
		}
	});
}

function bindToListenerWrapper(key) {
	return function (listener, target) {
		setGlobalDragState(key, (previousListeners) => [
			...(previousListeners || []),
			{ listener, target },
		]);
		return () => {
			setGlobalDragState(key, (previousListeners) =>
				previousListeners?.filter((listener) => listener.listener == listener)
			);
		};
	};
}

// Funções para adicionar listeners de drag a um componente.
export const onComponentDragBegin = bindToListenerWrapper("onDragBegin");
export const onComponentDragMove = bindToListenerWrapper("onDragMove");
export const onComponentDragEnd = bindToListenerWrapper("onDragEnd");

let currentMouseMoveEventHandler = null;
let currentMouseUpEventHandler = null;

document.addEventListener(
	"mousemove",
	(event) => currentMouseMoveEventHandler && currentMouseMoveEventHandler(event)
);
document.addEventListener(
	"mouseup",
	(event) => currentMouseUpEventHandler && currentMouseUpEventHandler(event)
);

// Deixa disponível o estado de drag para os componentes.
export const useDragState = () => {
	return { setGlobalDragState, useGlobalDragState };
};

// Contexto que permite arrastar um modal.
const DragableModalContext = React.forwardRef(({ children, uuid, modal }, ref) => {
	const [isDragging, setIsDragging] = useGlobalDragState("isDragging");
	const [_, setCurrentComponentGettingDraggedUUID] = useGlobalDragState(
		"currentComponentGettingDraggedUUID"
	);

	const [onDragBegin] = useGlobalDragState("onDragBegin");
	const [onDragEnd] = useGlobalDragState("onDragEnd");
	const [onDragMove] = useGlobalDragState("onDragMove");

	uuid.current = uuid.current || uuidv4();

	function getChild() {
		return modal?.current?.children?.[0];
	}

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
		function onMouseMove(event) {
			invokeListeners(onDragMove, uuid, event);
			event.preventDefault();
			event.stopPropagation();
		}

		function onMouseUp(event) {
			invokeListeners(onDragEnd, uuid, event);

			setIsDragging(false);
			setCurrentComponentGettingDraggedUUID(null);

			currentMouseMoveEventHandler = null;
			currentMouseUpEventHandler = null;

			event.preventDefault();
			event.stopPropagation();
		}

		function onMouseDown(event) {
			if (isDragging) {
				return null;
			}

			// Pega o elemento que foi clicado
			const { target } = event;

			// Verifica se o elemento clicado é o mesmo que o ref
			if (getChild() != target) {
				return null;
			}

			// Atualiza o estado de drag
			setIsDragging(true);
			setCurrentComponentGettingDraggedUUID(uuid);

			// Invoca os listeners de drag begin do elemento
			invokeListeners(onDragBegin, uuid, event);

			currentMouseMoveEventHandler = onMouseMove;
			currentMouseUpEventHandler = onMouseUp;
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
