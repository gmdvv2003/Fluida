import { useState, useEffect } from "react";

// https://blog.openreplay.com/steps-to-develop-global-state-for-react-with-hooks-without-context/
const createContainer = (initialState) => {
	let globalState = initialState;
	const listeners = Object.fromEntries(Object.keys(initialState).map((key) => [key, new Set()]));

	const setGlobalState = (key, nextValue) => {
		globalState = { ...globalState, [key]: nextValue };
		listeners[key].forEach((listener) => listener());
	};

	const useGlobalState = (key) => {
		const [state, setState] = useState(globalState[key]);
		useEffect(() => {
			const listener = () => {
				setState(globalState[key]);
			};
			listeners[key].add(listener);
			listener(); // in case it's already changed
			return () => listeners[key].delete(listener); // cleanup
		}, [key]);
		return [state, (nextValue) => setGlobalState(key, nextValue)];
	};

	return {
		setGlobalState,
		useGlobalState,
	};
};

export default createContainer;
