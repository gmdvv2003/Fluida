import { createSearchParams, useNavigate } from "react-router-dom";
import { useAuthentication } from "context/AuthenticationContext";

function PrivateRoute({ children }) {
	const { currentUserSession, setOnLoginCallback } = useAuthentication();
	if (!currentUserSession) {
		const navigate = useNavigate();

		// Define o callback de login para o redirecionamento
		setOnLoginCallback(() => {
			const searchParameters = new URLSearchParams(window.location.search);
			if (searchParameters.has("redirectTo")) {
				return navigate(atob(searchParameters.get("redirectTo")));
			}
		});

		// Redireciona para a página de login com a url atual como parâmetro
		return navigate({
			pathname: "/login",
			search: createSearchParams({
				ignoreRedirect: true,
				redirectTo: btoa(window.location.pathname),
			}),
		});
	}

	return children;
}

export default PrivateRoute;
