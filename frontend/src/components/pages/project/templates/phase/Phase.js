import React, { Suspense, useEffect, useImperativeHandle, useRef } from "react";

import { ReactComponent as PlusIcon } from "assets/action-icons/add-circle-unlined.svg";
import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";

import TextInputField from "components/shared/text-input-field/TextInputField";
import LoadingDots from "components/shared/loading/LoadingDots";

import LazyLoader from "utilities/lazy-loader/LazyLoader";
import DragableModal from "utilities/dragable-modal/DragableModal";

import Card from "../card/Card";

import "./Phase.css";

const Phase = React.forwardRef(({ isLoading, phase, projectState, ...callbacks }, ref) => {
	const phasesContainerRef = useRef(null);

	const lazyLoaderTopOffsetRef = useRef(null);
	const lazyLoaderBottomOffsetRef = useRef(null);

	const backgroundRef = useRef(null);

	useImperativeHandle(
		ref,
		() => ({
			ref: backgroundRef,
		}),
		[]
	);

	return (
		<DragableModal
			order={phase?.phaseDTO?.order}
			// Esqueleto de drag
			draggingSkeleton={() => (
				<div className="PP-background">
					<h1>Salve</h1>
				</div>
			)}
			// Elementos do modal
			elements={
				<div className="PP-background" ref={backgroundRef}>
					<Suspense fallback={<LoadingDots />}>
						{isLoading ? (
							<div className="PP-center-lock">
								<LoadingDots style={{ width: "32px", height: "32px" }} />
							</div>
						) : (
							<div>
								<div className="PP-header">
									<TextInputField
										name="title"
										placeholder="Nome da Fase"
										style={{ backgroundColor: "white", width: "100%", height: "100%" }}
									/>
									<PlusIcon className="PP-header-icon" />
									<DotsIcon className="PP-header-icon" />
								</div>

								<div>
									<div ref={lazyLoaderTopOffsetRef} />
									<div className="PP-cards-container" ref={phasesContainerRef}>
										<Card />
									</div>
									<div ref={lazyLoaderBottomOffsetRef} />
								</div>
							</div>
						)}
					</Suspense>
				</div>
			}
			// Callbacks
			callbacks={callbacks}
			// Referência para o modal
			ref={ref}
		></DragableModal>
	);
});

export default Phase;
