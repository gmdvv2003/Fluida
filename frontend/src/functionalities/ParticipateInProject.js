import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { useProjectAuthentication } from "context/ProjectAuthenticationContext";

import Loading from "components/shared/loading/Loading";

function ParticipateInProject({ children }) {
	const [waitingForParticipation, setWaitingForParticipation] = useState(false);
	const [navigateToHome, setNavigateToHome] = useState(false);

	const { projectId } = useParams();

	const { participate } = useProjectAuthentication();

	useEffect(() => {
		if (!projectId) {
			return setNavigateToHome(true);
		}

		participate(projectId)
			.then((response) => setNavigateToHome(!response.success))
			.catch(() => setNavigateToHome(true))
			.finally(() => setWaitingForParticipation(false));
	}, []);

	if (waitingForParticipation) {
		return <Loading />;
	} else if (navigateToHome) {
		return <Navigate to="/home" />;
	} else {
		return { children };
	}
}

export default ParticipateInProject;
