import { Navigate } from "react-router-dom";
import { useAuthentication } from "context/AuthenticationContext";

function PrivateRoute({ children }) {
	const { currentUser } = useAuthentication();
	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	return children;
}

export default PrivateRoute;
