import { Navigate } from "react-router-dom";
import { useAuthentication } from "context/AuthenticationContext";

function PrivateRoute({ children }) {
	const { currentUserSession } = useAuthentication();
	if (!currentUserSession) {
		return <Navigate to="/login" />;
	}

	return children;
}

export default PrivateRoute;
