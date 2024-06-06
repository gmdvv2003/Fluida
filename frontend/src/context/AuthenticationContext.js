import { PerformLoginEndpoint, PerformLogoutEndpoint } from "utilities/Endpoints";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
	getFromLocalStorage,
	removeFromLocalStorage,
	setLocalStorage,
} from "functionalities/LocalStorage";

import { decryptData } from "utilities/PBKDF2Decrypt/PBKDF2Decrypt";

const AuthenticationContext = createContext();

export function useAuthentication() {
	return useContext(AuthenticationContext);
}

export function AuthenticationProvider({ children }) {
	const [currentUserSession, setCurrentUserSession] = useState(
		getFromLocalStorage("currentUserSession")
	);

	const onLoginCallbackReference = useRef(null);
	const onLogoutCallbackReference = useRef(null);

	// Hook de navegação
	const __onLoginRedirectCallbackReference = useRef(() => {});
	const __onLogoutRedirectCallbackReference = useRef(() => {});

	/**
	 * Realiza o login do usuário
	 *
	 * @param {string} email
	 * @param {string} password
	 * @returns {Object}
	 */
	async function login(email, password, { ignoreRedirect = true }) {
		if (currentUserSession) {
			return { success: false };
		}

		const response = await PerformLoginEndpoint("POST", JSON.stringify({ email, password }));
		if (response.success && response.data?.success) {
			decryptData(response?.data?.data, email + password)
				.then((decryptedData) => {
					setCurrentUserSession({
						sessionToken: response?.data?.sessionToken,
						...JSON.parse(decryptedData),
					});

					// Salva a sessão do usuário no local storage
					setLocalStorage("currentUserSession", currentUserSession);

					if (response.data?.redirect && !ignoreRedirect) {
						__onLoginRedirectCallbackReference.current(response.data.redirect);
					}

					if (onLoginCallbackReference.current) {
						onLoginCallbackReference.current();
					}

					// Limpa o callback de login
					onLoginCallbackReference.current = null;
				})
				.catch(() => logout);
		}

		return response;
	}

	/**
	 * Realiza o logout do usuário
	 *
	 * @returns {Object}
	 */
	async function logout() {
		if (!currentUserSession) {
			return { success: false };
		}

		// Limpa a sessão do usuário
		setCurrentUserSession(null);

		// Remove a sessão do usuário do local storage
		removeFromLocalStorage("currentUserSession");

		if (onLogoutCallbackReference.current) {
			onLogoutCallbackReference.current();
		}

		// Limpa o callback de logout
		onLogoutCallbackReference.current = null;

		// Realiza o logout no servidor e redireciona para a página de login
		await performAuthenticatedRequest(PerformLogoutEndpoint, "POST", null, true).finally(() =>
			__onLogoutRedirectCallbackReference.current()
		);
	}

	/**
	 * Realiza uma requisição onde o usuário precisa estar autenticado
	 *
	 * @param {Object} endpoint
	 * @param {string} method
	 * @param {Object} body
	 * @returns {Object}
	 */
	async function performAuthenticatedRequest(endpoint, method, body, ignoreLogout = false) {
		if (!currentUserSession) {
			return { success: false };
		}

		const response = await endpoint(method, body, {
			Authorization: currentUserSession.sessionToken,
		});

		if (response.status == 401 && !ignoreLogout) {
			// Limpa a sessão do usuário
			logout();
		}

		return response;
	}

	useEffect(() => {
		setLocalStorage("currentUserSession", currentUserSession);
	}, [currentUserSession]);

	return (
		<AuthenticationContext.Provider
			value={{
				currentUserSession,
				login,
				logout,
				performAuthenticatedRequest,
				onLoginCallbackReference,
				onLogoutCallbackReference,
				__onLoginRedirectCallbackReference,
				__onLogoutRedirectCallbackReference,
			}}
		>
			{children}
		</AuthenticationContext.Provider>
	);
}
