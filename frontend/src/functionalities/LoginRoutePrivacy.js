import { Navigate } from "react-router-dom";

import { useAuthentication } from "context/AuthenticationContext";

function LoginRoutePrivacy({ children }) {
	const { currentUserSession } = useAuthentication();
	return currentUserSession ? <Navigate to="/home" /> : children;
}

export default LoginRoutePrivacy;
