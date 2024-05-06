import { createContext, useContext, useState, useEffect } from "react";

import { PerformLoginEndpoint, PerformLogoutEndpoint } from "utilities/Endpoints";

const AuthenticationContext = createContext();

export function useAuthentication() {
	return useContext(AuthenticationContext);
}

export function AuthenticationProvider({ children }) {
	const [currentUserSession, setCurrentUserSession] = useState({
		session:
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdtLmRhZ2hsaWFuQGdtYWlsLmNvbSIsInVzZXJJZCI6MSwiaWF0IjoxNzE0NTIwNDM3LCJleHAiOjQ5MTQ1MTcyMzcsImF1ZCI6WyJBbGwiXSwiaXNzIjoiRmx1aWRhIn0.GVUyQYQA6gNkUm5aKmooD_6TiCacGWsAnsDd295TtDmbOccKTnpWhf5tvF9Nk1CrocP_OnC6cqCdyXPsRm6joCF2Watth3jj4yODuujDSkWV2OKp7TkglwbdyWokCjqqA0l4eiwo0Py82RnYZsYRUkAG6z4R7TUW9lBYDpNlBJqCw75l91P1M8ZltIbCOtBr1wJmw9wvIDldGPK50zdIkNCuo4CsksHA7iwaAd80nTHZjasJoOeOSOeePY4aZtpkJVFwhmbtIe5yM3TdeH5s-qC9CjezfU_aV_D2vVYt5XSeZXwuUpYqb3WkVfgNAB2DP6cxeO2icaQyuVSk1MvPOQ",
		userId: 1,
	});
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
			setCurrentUserSession({
				session: response.data?.session,
				userId: response.data?.userId,
			});

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

		return await performAuthenticatedRequest(PerformLogoutEndpoint, "POST", JSON.stringify({ userId: currentUserSession.userId }));
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

		return await endpoint(method, body, { Authorization: currentUserSession.session });
	}

	useEffect(() => {}, []);

	return (
		<AuthenticationContext.Provider value={{ currentUserSession, login, logout, performAuthenticatedRequest }}>
			{!loadingUser && children}
		</AuthenticationContext.Provider>
	);
}
