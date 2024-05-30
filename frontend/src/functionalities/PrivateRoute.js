import { useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

import { useAuthentication } from "context/AuthenticationContext";

function PrivateRoute({ children, redirectAutomatically = false }) {
	// Utiliza o hook de navegação
	const navigate = useNavigate();

	const { currentUserSession, onLoginCallbackReference } = useAuthentication();

	useEffect(() => {
		if (!currentUserSession) {
			const searchParameters = new URLSearchParams(window.location.search);
			if (searchParameters.has("ignoreRedirect")) {
				return undefined;
			}

			// Define o callback de login para o redirecionamento
			onLoginCallbackReference.current = () => {
				const searchParameters = new URLSearchParams(window.location.search);
				if (searchParameters.has("redirectTo")) {
					navigate(atob(searchParameters.get("redirectTo")));
				}
			};

			if (redirectAutomatically) {
				// Redireciona para a página de login com a url atual como parâmetro
				navigate({
					pathname: "/login",
					search: createSearchParams({
						ignoreRedirect: false,
						redirectTo: btoa(window.location.pathname),
					}).toString(),
				});
			} else {
				navigate("/login");
			}
		}
	}, []);

	return currentUserSession && children;
}

export default PrivateRoute;
