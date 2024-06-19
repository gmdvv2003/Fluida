import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import ReactSubscriptionHelper from "utilities/react-subscription-helper/ReactSubscriptionHelper";

const LazyLoader = React.forwardRef(
	(
		{
			className,
			canFillWithContent,
			update,
			topLeftOffset,
			bottomRightOffset,
			scrollBarRef,
			constructElement,
			width,
			height,
			margin,
			padding,
			direction,
			fetchMore,
			getAvailableContentCountForFetch,
			insertFetchedElement,
			pageSize,
			getContent,
		},
		ref
	) => {
		// Conteúdo a ser exibido na tela
		const [visibleContent, setVisibleContent] = useState([]);

		// Referências das intancias dos elementos que estão sendo exibidos na tela
		const visibleContentDataRefs = useRef([]);

		const placeholdersContent = useRef([]);
		const placeholdersContentRefs = useRef({});

		const associatedPlaceholdersRefs = useRef({});

		const [topOffset, setTopOffset] = useState(0);
		const [bottomOffset, setBottomOffset] = useState(0);

		const visibleViewportContentChangedListeners = new ReactSubscriptionHelper();

		useImperativeHandle(
			ref,
			() => ({
				visibleViewportContentChanged: (callback) => {
					return visibleViewportContentChangedListeners.subscribe(callback);
				},
				/**
				 *
				 * @param {*} element
				 * @returns
				 */
				getComponentDataFromRef: (element) => {
					return (
						visibleContentDataRefs.current.find(({ current }) => {
							return current == element;
						}) || {}
					);
				},

				/**
				 *
				 * @param {*} ref
				 * @returns
				 */
				getAssociatedPlaceholder: (ref) => {
					return associatedPlaceholdersRefs.current[ref];
				},

				/**
				 *
				 * @param {*} ref
				 * @returns
				 */
				getPlaceholderFromRef: (ref) => {
					return placeholdersContent.current.find(({ element }) => {
						return element == ref;
					});
				},

				/**
				 *
				 * @param {*} ref
				 * @param {*} uuid
				 */
				associatePlaceholder: (ref, uuid) => {
					placeholdersContent.current.forEach((element) => {
						if (element.uuid == uuid) {
							associatedPlaceholdersRefs.current[ref] = element;
						}
					});
				},

				/**
				 *
				 * @param {*} uuid
				 */
				removePlaceholderAssociation: (uuid) => {
					Object.keys(associatedPlaceholdersRefs.current).forEach((key, _, value) => {
						if (value.uuid == uuid) {
							delete associatedPlaceholdersRefs.current[key];
						}
					});
				},

				/**
				 *
				 * @param {*} element
				 * @param {*} index
				 * @returns
				 */
				addPlaceholder: (index, makePlaceholder, ...placeholderData) => {
					const uuid = uuidv4();

					// Função para setar a referência do elemento
					let setReference = (element) => {
						if (element == null) {
							return null;
						}

						placeholdersContentRefs.current[uuid] = element;
					};

					// Cria o placeholder
					const placeholder = makePlaceholder(setReference, ...placeholderData);

					// Adiciona o placeholder na lista de placeholders
					placeholdersContent.current.splice(index, 0, {
						isPlaceholder: true,
						placeholder,
						uuid,
						getReference: () => placeholdersContentRefs.current[uuid],
					});

					// Adiciona o placeholder como um elemento visível
					setVisibleContent((visibleContent) => {
						return [...visibleContent, placeholdersContent.current[0]];
					});

					return uuid;
				},

				/**
				 *
				 * @param {*} uuid
				 */
				removePlaceholder: (uuid) => {
					placeholdersContent.current = placeholdersContent.current.filter((placeholder) => placeholder.uuid != uuid);

					// Remove a associação do placeholder ao elemento
					ref.current.removePlaceholderAssociation(uuid);

					// Remove o placeholder da lista de elementos visíveis
					setVisibleContent((visibleContent) => {
						return visibleContent.filter((element) => element == undefined || element.uuid != uuid);
					});
				},

				settings: {
					width,
					height,
					margin,
					padding,
					direction,
				},
			}),
			[]
		);

		useEffect(() => {
			const scrollBarCopy = scrollBarRef?.current;

			if (!scrollBarCopy) {
				return undefined;
			}

			let sectionFetchTimeoutId;

			let currentSectionStart = 0;
			let currentSectionEnd = pageSize;

			let lastSectionStart = 0;
			let lastSectionEnd = 0;

			let lastItemIndex = 0;

			/**
			 * Retorna o conteúdo a ser exibido na tela
			 * (Realiza o fetch de mais conteúdo caso necessário)
			 *
			 * @param {number} start
			 * @param {number} end
			 * @returns {Array}
			 */
			async function retrieveVisibleContent(start, end, lateFetch) {
				if (getContent() == undefined) {
					return [];
				}

				end = Math.min(end, await getAvailableContentCountForFetch());

				// Caso não tenha conteúdo, preenche a lista com conteúdo vazio
				if (getContent().length < end) {
					for (let index = getContent().length; index < end; index += 1) {
						getContent().splice(index, 0, undefined);
					}
				}

				// Pega a "fatia" do conteúdo que está sendo exibido no momento e verifica se há algum elemento indefinido
				const undefinedContentIndex = getContent()
					.slice(start, end)
					.findIndex((element) => element === undefined);

				if (undefinedContentIndex > -1) {
					if (end !== lastSectionEnd || start !== lastSectionStart || true) {
						// Cancela o timeout anterior
						if (sectionFetchTimeoutId) {
							clearTimeout(sectionFetchTimeoutId);
						}
						// Inicia um novo timeout
						sectionFetchTimeoutId = setTimeout(async () => {
							const fetchedContent = await fetchMore(1 + Math.floor((start + undefinedContentIndex) / pageSize));
							fetchedContent.forEach((element, index) => {
								const contentIndex = start + undefinedContentIndex + index;
								if (getContent()[contentIndex] == undefined) {
									getContent()[contentIndex] =
										insertFetchedElement != undefined ? insertFetchedElement(element) : element;
								}
							});

							// Atualiza o conteúdo a ser exibido na tela
							lateFetch(getContent().slice(start, end));
						}, 200);
					}
				}

				// Retorna novamente a "fatia" do conteúdo que está sendo exibido no momento
				return getContent().slice(start, end);
			}

			/**
			 * Retorna o número máximo de elementos que podem ser exibidos na tela
			 *
			 * @returns {number}
			 */
			function getMaxPossibleElementsInContainer() {
				return 100;
			}

			/**
			 *
			 */
			async function getTopLeftOffset() {
				switch (direction) {
					case "horizontal":
						return currentSectionStart * (width + padding) + margin;

					case "vertical":
						return currentSectionStart * (height + padding) + margin;

					default:
						break;
				}
			}

			/**
			 *
			 */
			async function getBottomRightOffset() {
				switch (direction) {
					case "horizontal":
						return (
							Math.max((await getAvailableContentCountForFetch()) - 1, 0) * (width + padding) -
							getContent().length * (width + padding)
						);

					case "vertical":
						return (
							Math.max((await getAvailableContentCountForFetch()) - 1, 0) * (height + padding) -
							getContent().length * (height + padding)
						);

					default:
						break;
				}
			}

			/**
			 * Retorna os limites da seção atual
			 *
			 * @returns {number}
			 */
			function getSectionThreshold() {
				return Math.floor(getMaxPossibleElementsInContainer());
			}

			/**
			 * Retorna o índice do item que está sendo exibido no momento
			 *
			 * @returns {number}
			 */
			function getCurrentItemIndex() {
				switch (direction) {
					case "horizontal":
						return Math.max(0, Math.floor((scrollBarCopy.scrollLeft - margin) / (width + padding)));

					case "vertical":
						return Math.max(0, Math.floor((scrollBarCopy.scrollTop - margin) / (height + padding)));

					default:
						return 0;
				}
			}

			/**
			 * Retorna os limites da seção atual
			 *
			 * @param {number} offset
			 * @returns {[number, number]}
			 */
			function getSectionBounds(offset) {
				const maxPossibleElementsInContainer = getMaxPossibleElementsInContainer();

				// Retorna o multiplo mais próximo para baixo e para cima do offset
				const start = offset - (offset % maxPossibleElementsInContainer);
				const end = offset + maxPossibleElementsInContainer - (offset % maxPossibleElementsInContainer);

				return [start, end];
			}

			/**
			 * Função responsável por carregar o conteúdo a ser exibido na tela
			 */
			async function setDisplayableContent() {
				let update = (visibleContent) => {
					// Reseta as referências dos elementos que estão sendo exibidos na tela
					visibleContentDataRefs.current = [];

					// Atualiza o conteúdo a ser exibido na tela
					setVisibleContent((_) => [...visibleContent, ...placeholdersContent.current]);
				};

				update(await retrieveVisibleContent(currentSectionStart, currentSectionEnd, update));
			}

			/**
			 * Função responsável por lidar com o evento de scroll
			 */
			async function handleScroll() {
				// Atualiza o item que está sendo exibido no momento
				let currentItemIndex = getCurrentItemIndex();

				// Margem superior e inferior da seção
				const sectionThreshold = getSectionThreshold();

				// Pega os limites da seção atual e expande a seção para cima e para baixo se necessário
				const [sectionStart, sectionEnd] = getSectionBounds(currentItemIndex);
				if (currentItemIndex - sectionStart <= sectionThreshold) {
					currentSectionStart = Math.max(0, sectionStart - getMaxPossibleElementsInContainer());
				}

				if (sectionEnd - currentItemIndex <= sectionThreshold) {
					currentSectionEnd = sectionEnd + getMaxPossibleElementsInContainer();
				}

				// Caso a seção atual seja diferente da seção anterior, atualiza o conteúdo a ser exibido na tela
				if (currentItemIndex !== lastItemIndex) {
					setDisplayableContent();
				}

				if (direction === "horizontal") {
					topLeftOffset.current.style.width = (await getTopLeftOffset()) + "px";
					bottomRightOffset.current.style.width = (await getBottomRightOffset()) + "px";
				} else {
					topLeftOffset.current.style.height = (await getTopLeftOffset()) + "px";
					bottomRightOffset.current.style.height = (await getBottomRightOffset()) + "px";
				}

				lastSectionStart = currentSectionStart;
				lastSectionEnd = currentSectionEnd;

				// "Salva" o index do ultimo item que foi exibido
				lastItemIndex = currentItemIndex;
			}

			const initialItemIndex = getCurrentItemIndex();
			if (initialItemIndex === 0) {
				setDisplayableContent();
			}

			// Seta a função de atualização do conteúdo a ser exibido na tela
			if (update !== undefined) {
				update.current = setDisplayableContent;
			}

			// Garante que os elementos de offset fiquem fixos no inicio e no final do container
			topLeftOffset.current.style.order = "-100000000";
			bottomRightOffset.current.style.order = "100000000";

			scrollBarCopy.addEventListener("scroll", handleScroll, { passive: true });

			// Update inicial manual
			setDisplayableContent();

			return () => {
				scrollBarCopy.removeEventListener("scroll", handleScroll);
			};
		}, [update, scrollBarRef]);

		return (
			<div className={className}>
				{visibleContent.map((data, index) => {
					if (data?.isPlaceholder) {
						return data?.placeholder;
					}

					// Função para setar a referência do elemento
					const setReference = (element) => {
						if (element == null) {
							return null;
						}

						const { ref } = element;
						visibleContentDataRefs.current[index] = { current: ref.current, data, index };
					};

					if (data === undefined) {
						return constructElement(null, index, true, setReference);
					} else {
						return constructElement(data, index, false, setReference);
					}
				})}
			</div>
		);
	}
);

export default LazyLoader;
