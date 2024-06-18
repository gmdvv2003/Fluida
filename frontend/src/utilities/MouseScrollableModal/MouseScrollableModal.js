import React, { useRef, useState, useEffect, useImperativeHandle } from "react";

const MouseScrollableModal = React.forwardRef(({ SCROLL_SPEED = 15, DEAD_ZONE_LENGTH = 400, scrollableDivRef, children }, ref) => {
	// State "interno" para controlar se o processo de animação de frame está rodando
	const [__isAnimationFrameProcessRunning, __setIsAnimationFrameProcessRunning] = useState(false);

	const isMouseScrollingEnabled = useRef(false);

	let horizontalPenetration = 0;
	let verticalPenetration = 0;

	const __onAnimationFrameCallback = useRef(null);

	useImperativeHandle(
		ref,
		() => ({
			enableMouseScrolling: () => {
				isMouseScrollingEnabled.current = true;
			},

			disableMouseScrolling: () => {
				if (isMouseScrollingEnabled.current) {
					__setIsAnimationFrameProcessRunning(false);
				}

				isMouseScrollingEnabled.current = false;
			},
		}),
		[]
	);

	useEffect(() => {
		__onAnimationFrameCallback.current = () => {
			const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = scrollableDivRef.current;
			scrollableDivRef.current.scrollTo({
				top: Math.min(scrollHeight + clientHeight, scrollTop + verticalPenetration * SCROLL_SPEED),
				left: Math.min(scrollWidth + clientWidth, scrollLeft + horizontalPenetration * SCROLL_SPEED),
			});
		};

		function onMouseMove(event) {
			if (!isMouseScrollingEnabled.current) {
				return null;
			}

			// Pega a posição do mouse
			const { clientX, clientY } = event;

			// Pega as dimensões do scrollableDiv
			const { offsetLeft, offsetTop, clientWidth, clientHeight, scrollWidth, scrollHeight } = scrollableDivRef.current;

			// if - Verifica se o mouse está no canto esquerdo
			// else if - Verifica se o mouse está no canto direito
			if (clientX > offsetLeft && clientX < offsetLeft + DEAD_ZONE_LENGTH) {
				// Calcula o quão proximo o mouse está do canto esquerdo
				horizontalPenetration = ((offsetLeft + DEAD_ZONE_LENGTH - clientX) / DEAD_ZONE_LENGTH) * -1;
			} else if (clientX < offsetLeft + clientWidth && clientX > offsetLeft + clientWidth - DEAD_ZONE_LENGTH) {
				// Calcula o quão proximo o mouse está do canto direito
				horizontalPenetration = (clientX - (offsetLeft + clientWidth - DEAD_ZONE_LENGTH)) / DEAD_ZONE_LENGTH;
			} else {
				horizontalPenetration = 0;
			}

			// if - Verifica se o mouse está no topo
			// else if - Verifica se o mouse está na base

			if (clientY > offsetTop && clientY < offsetTop + DEAD_ZONE_LENGTH) {
				// Calcula o quão proximo o mouse está do topo
				verticalPenetration = ((offsetTop + DEAD_ZONE_LENGTH - clientY) / DEAD_ZONE_LENGTH) * -1;
			} else if (clientY < offsetTop + clientHeight && clientY > offsetTop + clientHeight - DEAD_ZONE_LENGTH) {
				// Calcula o quão proximo o mouse está da base
				verticalPenetration = (clientY - (offsetTop + clientHeight - DEAD_ZONE_LENGTH)) / DEAD_ZONE_LENGTH;
			} else {
				verticalPenetration = 0;
			}

			const performAnimationFrameProcess = horizontalPenetration !== 0 || verticalPenetration !== 0;
			if (__isAnimationFrameProcessRunning === performAnimationFrameProcess) {
				return null;
			}

			__setIsAnimationFrameProcessRunning(performAnimationFrameProcess);
		}

		window.addEventListener("mousemove", onMouseMove);

		return () => {
			window.removeEventListener("mousemove", onMouseMove);
		};
	}, []);

	useEffect(() => {
		function __animate() {
			if (!__isAnimationFrameProcessRunning || !isMouseScrollingEnabled.current) {
				return null;
			}

			// Realiza a requisição do próximo frame de animação
			window.requestAnimationFrame(__animate);

			// Chama o callback de animação de frame
			__onAnimationFrameCallback.current();
		}

		window.requestAnimationFrame(__animate);
	}, [__isAnimationFrameProcessRunning]);

	return children;
});

export default MouseScrollableModal;
