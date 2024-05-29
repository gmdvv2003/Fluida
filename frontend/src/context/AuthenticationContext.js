import { createContext, useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PerformLoginEndpoint, PerformLogoutEndpoint } from "utilities/Endpoints";

const AuthenticationContext = createContext();

export function useAuthentication() {
	return useContext(AuthenticationContext);
}

export function AuthenticationProvider({ children }) {
	const [currentUserSession, setCurrentUserSession] = useState(null);
	const [loadingUser, setLoadingUser] = useState(false);

	const onLoginCallbackReference = useRef(null);
	const onLogoutCallbackReference = useRef(null);

	const navigate = useNavigate();

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
		if (response.success) {
			setCurrentUserSession({
				sessionToken: response.data?.sessionToken,
				userId: response.data?.userId,
			});

			if (response.data?.redirect && !ignoreRedirect) {
				navigate(new URL(response.data.redirect).pathname, { replace: true });
			}

			if (onLoginCallbackReference.current) {
				onLoginCallbackReference.current();
			}

			// Limpa o callback de login
			onLoginCallbackReference.current = null;
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

		if (onLogoutCallbackReference.current) {
			onLogoutCallbackReference.current();
		}

		// Limpa o callback de logout
		onLogoutCallbackReference.current = null;

		// Realiza o logout no servidor e redireciona para a página de login
		await performAuthenticatedRequest(PerformLogoutEndpoint, "POST", null, true).finally(() => navigate("/login"));
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
		console.log(currentUserSession);
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

	useEffect(() => {}, []);

	return (
		<AuthenticationContext.Provider
			value={{
				currentUserSession,
				login,
				logout,
				performAuthenticatedRequest,
				onLoginCallbackReference,
				onLogoutCallbackReference,
			}}
		>
			{!loadingUser && children}
		</AuthenticationContext.Provider>
	);
}
