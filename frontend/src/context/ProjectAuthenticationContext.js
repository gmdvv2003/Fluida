import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

import { createContext, useContext, useState, useEffect } from "react";

import { ParticipateInProjectEndpoint, ProjectsSocketEndpoint } from "utilities/Endpoints";
import { useAuthentication } from "context/AuthenticationContext";

const ProjectAuthenticationContext = createContext();

export function useProjectAuthentication() {
	return useContext(ProjectAuthenticationContext);
}

export function ProjectAuthenticationProvider({ children }) {
	const [authenticatedProjectsSessions, setAuthenticatedProjectsSessions] = useState([]);

	const { currentUserSession, performAuthenticatedRequest } = useAuthentication();

	/**
	 * Indica se o usuário está participando do projeto.
	 *
	 * @param {number} projectId
	 * @returns {Object}
	 */
	function isParticipating(projectId) {
		return authenticatedProjectsSessions.find((session) => {
			return session.projectId === projectId;
		});
	}

	/**
	 * Pega a sessão do projeto.
	 *
	 * @param {number} projectId
	 * @returns {Object}
	 */
	function getProjectSession(projectId) {
		return isParticipating(projectId);
	}

	/**
	 * Tenta realizar a participação do usuário no projeto.
	 *
	 * @param {number} projectId
	 * @returns {Promise}
	 */
	async function participate(projectId) {
		return new Promise(async (resolve, reject) => {
			// Verifica se o usuário está logado
			if (!currentUserSession) {
				return resolve({ success: false });
			}

			// Verifica se o usuário já está participando do projeto
			if (isParticipating(projectId) !== -1) {
				return resolve({ success: false });
			}

			// Realiza a requisição para participar do projeto
			const response = await performAuthenticatedRequest(ParticipateInProjectEndpoint, "POST", JSON.stringify({ projectId }));
			if (response.success) {
				const { participationToken } = response.data;

				// Cria uma nova instância do socket com o token de participação
				const socket = io(ProjectsSocketEndpoint, {
					auth: {
						sessionToken: currentUserSession,
						socketToken: participationToken,
					},
				}).of(`/${projectId}`);

				// Evento que roda quando ocorre um erro na conexão
				socket.on("connect_error", (error) => {
					let rejectPromise = false;

					switch (error.message) {
						case ("io server disconnect", "io client disconnect", "ping timeout", "transport error"):
							rejectPromise = true;
							break;

						case "transport close":
							break;

						default:
							rejectPromise = true;
							break;
					}

					if (rejectPromise) {
						try {
							socket.disconnect();
						} catch (error) {
							console.error(`Erro ao desconectar o socket: ${error.message}`);
						}

						reject(error);
					}

					console.error(`Erro ao conectar no socket: ${error.message}`);
				});

				// Evento que roda quando a conexão é estabelecida
				socket.on("connect", () => {
					setAuthenticatedProjectsSessions([
						...authenticatedProjectsSessions,
						{
							projectId: projectId,
							socket: socket,
						},
					]);
				});

				// Evento que roda quando a conexão é encerrada
				socket.on("disconnect", () => {
					setAuthenticatedProjectsSessions(authenticatedProjectsSessions.filter((session) => session.projectId !== projectId));
				});

				// Evento que roda quando o usuário se inscreve no projeto
				socket.on("subscribedToProject", () => {
					resolve({ success: true });
				});
			}

			return resolve({ success: false });
		});
	}

	/**
	 * Realiza a remoção do usuário do projeto.
	 *
	 * @param {number} projectId
	 * @returns {Promise}
	 */
	async function leave(projectId) {
		if (!currentUserSession) {
			return { success: false };
		}

		// Verifica se o usuário está participando do projeto
		const projectSessionIndex = isParticipating(projectId);
		if (projectSessionIndex === -1) {
			return { success: false };
		}

		// Desconecta o socket do projeto
		const { socket } = authenticatedProjectsSessions[projectSessionIndex];
		socket.emit("unsubscribeFromProject");

		try {
			socket.disconnect();
		} catch (error) {
			console.error(`Erro ao desconectar o socket: ${error.message}`);
		}
	}

	useEffect(() => {});

	return (
		<ProjectAuthenticationContext.Provider value={{ getProjectSession, participate, leave }}>
			{children}
		</ProjectAuthenticationContext.Provider>
	);
}
