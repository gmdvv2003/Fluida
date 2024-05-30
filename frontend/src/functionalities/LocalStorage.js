function setLocalStorage(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}

function removeFromLocalStorage(key) {
	localStorage.removeItem(key);
}

export { setLocalStorage, getFromLocalStorage, removeFromLocalStorage };
