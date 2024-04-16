import { createContext, useContext, useState, useEffect } from "react";

import { PerformLoginEndpoint, PerformLogoutEndpoint } from "utilities/Endpoints";

const AuthenticationContext = createContext();

export function useAuthentication() {
	return useContext(AuthenticationContext);
}

export function AuthenticationProvider({ children }) {
	const [currentUserSession, setCurrentUserSession] = useState(null);
	const [loadingUser, setLoadingUser] = useState(false);

	/**
	 * Realiza o login do usuário
	 *
	 * @param {string} email
	 * @param {string} password
	 * @returns {Object}
	 */
	async function login(email, password) {
		if (currentUserSession) {
			return { success: false };
		}

		const response = PerformLoginEndpoint("POST", JSON.stringify({ email, password }));
		if (response.success) {
			setCurrentUserSession(response.data?.session);

			if (response.data?.redirect) {
				window.location.href = response.data.redirect;
			}
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

		return await performAuthenticatedRequest(
			PerformLogoutEndpoint,
			"POST",
			JSON.stringify({ userId: currentUserSession.userId })
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
	async function performAuthenticatedRequest(endpoint, method, body) {
		if (!currentUserSession) {
			return { success: false };
		}

		return await endpoint(method, body, { Authentication: currentUserSession.session });
	}

	useEffect(() => {}, []);

	return (
		<AuthenticationContext.Provider
			value={{ currentUserSession, login, logout, performAuthenticatedRequest }}
		>
			{!loadingUser && children}
		</AuthenticationContext.Provider>
	);
}
