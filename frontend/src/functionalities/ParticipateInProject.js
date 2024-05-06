import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { useProjectAuthentication } from "context/ProjectAuthenticationContext";

import Loading from "components/shared/loading/Loading";

function ParticipateInProject({ children }) {
	const [waitingForParticipation, setWaitingForParticipation] = useState(true);
	const [navigateToHome, setNavigateToHome] = useState(false);

	const { projectId } = useParams();

	const { participate } = useProjectAuthentication();

	useEffect(() => {
		if (!projectId) {
			return setNavigateToHome(true);
		}

		let isCancelled = false;

		participate(parseInt(projectId)).then(({ success }) => {
			if (isCancelled) {
				return null;
			}

			setNavigateToHome(!success);
			setWaitingForParticipation(false);
		});

		return () => {
			isCancelled = true;
			setWaitingForParticipation(true);
			setNavigateToHome(false);
		};
	}, [projectId]);

	if (waitingForParticipation) {
		return <Loading />;
	} else if (navigateToHome) {
		return <Navigate to="/home" />;
	} else {
		return children;
	}
}

export default ParticipateInProject;
