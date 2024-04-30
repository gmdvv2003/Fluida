import { createContext, useContext, useState, useEffect } from "react";

import { PerformLoginEndpoint, PerformLogoutEndpoint } from "utilities/Endpoints";

const AuthenticationContext = createContext();

export function useAuthentication() {
	return useContext(AuthenticationContext);
}

export function AuthenticationProvider({ children }) {
	const [currentUserSession, setCurrentUserSession] = useState({
		session:
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImZpcnN0TmFtZSI6Ikd1aWxoZXJtZSIsImxhc3ROYW1lIjoiRGFnaGxpYW4iLCJlbWFpbCI6ImdtLmRhZ2hsaWFuQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiMTE5MTczNTk5NTYiLCJwYXNzd29yZCI6IkNhc2NvbGEwNGdtISIsInNlc3Npb25Ub2tlbiI6bnVsbCwiZW1haWxWYWxpZGF0aW9uVG9rZW4iOm51bGwsInBhc3N3b3JkUmVzZXRUb2tlbiI6bnVsbCwiZW1haWxWZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzE0MTg3NDA2LCJleHAiOjIwNzQxODM4MDYsImF1ZCI6WyJBbGwiXSwiaXNzIjoiRmx1aWRhIn0.hEE57MJtdH-9JB9RFXZzDGoDsPoWjefvkybHDviaRmGKxnA5SituuPtolv6FAj6l3DbvtmyfiZoaGu56YDmsEuaMfwOS-vdvHtxgH_7RbPCB_sDejpWDgfulgjQdpJOvMjawuMHMY0nPgTIR1UJgVDVNgtfZSpzS_5zLhA56llXBKHgs3Emuo_ZLgIcbwO1FnMHu2pr7Ak_xSPzWSeLZtM222Awg-01h_RdCzs8VkHujvUJqQTgbVWpSdACNlAsqLQZhLfSrZyAd-n_dvZrnU4PWndqV5u6wOBm8qoVPq3E1VbQigpx9C6MVCFKhjI4mJkdzcg8exdVYLHXeSMu1Pg",
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

		return await endpoint(method, body, { Authorization: currentUserSession.session });
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
