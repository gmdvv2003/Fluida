import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthentication } from "context/AuthenticationContext";

function LoginRedirect({ children }) {
	// Hook externo para redirecionamento após login
	const { __onLoginRedirectCallbackReference, __onLogoutRedirectCallbackReference } = useAuthentication();

	const navigate = useNavigate();

	useEffect(() => {
		__onLoginRedirectCallbackReference.current = (redirect) => {
			navigate(new URL(redirect).pathname, { replace: true });
		};

		__onLogoutRedirectCallbackReference.current = () => {
			navigate("/login", { replace: true });
		};
	});

	return children;
}

export default LoginRedirect;
