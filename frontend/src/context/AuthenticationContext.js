import { createContext, useContext, useState, useEffect } from "react";

const AuthenticationContext = createContext();

export function useAuthentication() {
	return useContext(AuthenticationContext);
}

export function AuthenticationProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [loadingUser, setLoadingUser] = useState(false);

	async function login() {
		if (currentUser) {
			return true;
		}
	}

	async function logout() {
		if (!currentUser) {
			return true;
		}
	}

	useEffect(() => {}, []);

	return (
		<AuthenticationContext.Provider value={{ currentUser, login, logout }}>{!loadingUser && children}</AuthenticationContext.Provider>
	);
}
