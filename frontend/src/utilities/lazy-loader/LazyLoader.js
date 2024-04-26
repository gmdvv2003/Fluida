import { useEffect, useState } from "react";

function LazyLoader({
	container,
	scrollBar,
	getContent,
	fetchMore,
	constructElement,
	loadingElement,
	width,
	margin,
	padding,
	height,
	direction,
}) {
	const [displayableContent, setDisplayableContent] = useState([]);

	const [topOffset, setTopOffset] = useState(0);
	const [bottomOffset, setBottomOffset] = useState(0);

	useEffect(() => {
		const containerCopy = container.current;
		const scrollBarCopy = scrollBar.current;

		const currentSectionStart = 0;
		const currentSectionEnd = 0;

		function getTopOffset() {}

		function getBottomOffset() {}

		function getMaxPossibleElementsInContainer() {
			switch (direction) {
				case "horizontal":
					return Math.ceil(scrollBarCopy.clientWidth / width);

				case "vertical":
					return Math.ceil(scrollBarCopy.clientHeight / height);

				default:
					return 0;
			}
		}

		function getLastItemIndex() {
			switch (direction) {
				case "horizontal":
					return Math.floor((scrollBarCopy.scrollLeft - margin) / (width + padding));

				case "vertical":
					return Math.floor(scrollBarCopy.scrollTop / height);

				default:
					return 0;
			}
		}

		async function getDisplayableContent() {
			console.log(getLastItemIndex());
		}

		async function handleScroll() {
			
		}

		scrollBarCopy.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			scrollBarCopy.removeEventListener("scroll", handleScroll);
		};
	}, [container, scrollBar]);

	return <div></div>;
}

export default LazyLoader;
