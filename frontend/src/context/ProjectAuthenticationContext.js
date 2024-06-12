import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

import { createContext, useContext, useState, useEffect, useRef } from "react";

import { ParticipateInProjectEndpoint, ProjectsSocketEndpoint } from "utilities/Endpoints";
import { useAuthentication } from "context/AuthenticationContext";

const ProjectAuthenticationContext = createContext();

export function useProjectAuthentication() {
	return useContext(ProjectAuthenticationContext);
}

export function ProjectAuthenticationProvider({ children }) {
	const [authenticatedProjectsSessions, setAuthenticatedProjectsSessions] = useState([]);

	const { currentUserSession, performAuthenticatedRequest } = useAuthentication();

	const projectsBeingValidated = useRef({});

	/**
	 * Indica se o usuário está participando do projeto.
	 *
	 * @param {number} projectId
	 * @returns {Object}
	 */
	function isParticipating(projectId) {
		return authenticatedProjectsSessions.find((session) => {
			return session.projectId == projectId;
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
		// Verifica se a participação no projeto já está sendo validada
		if (projectsBeingValidated.current[projectId]) {
			return new Promise((resolve, reject) => {
				projectsBeingValidated.current[projectId].finally(async () => {
					resolve(await participate(projectId));
				});
			});
		}

		const promise = new Promise(async (resolve, reject) => {
			// Verifica se o usuário está logado
			if (!currentUserSession) {
				return resolve({ success: false });
			}

			// Verifica se o usuário já está participando do projeto
			if (isParticipating(projectId) !== undefined) {
				return resolve({ success: true });
			}

			// Realiza a requisição para participar do projeto
			const response = await performAuthenticatedRequest(ParticipateInProjectEndpoint, "POST", JSON.stringify({ projectId }));

			if (response.success) {
				// Cria uma nova instância do socket com o token de participação
				const socket = io(ProjectsSocketEndpoint, {
					auth: {
						sessionToken: currentUserSession?.sessionToken,
						socketToken: response.data?.participationToken,
					},
				});

				/**
				 *
				 * @param {*} error
				 */
				function onError(error) {
					console.error("Erro no socket:", error?.message, error?.error);
				}

				/**
				 *
				 * @param {*} error
				 */
				function onConnectError(error) {
					console.error(`Erro ao conectar no socket: ${error.message}`);

					// Rejeita a promessa com o erro
					reject(error);
				}

				/**
				 *
				 */
				function onConnect() {
					socket.emit("subscribeToProject", { projectId });
				}

				/**
				 *
				 * @param {*} reason
				 */
				function onDisconnect(reason) {
					if (!reason.active) {
						// Remove a sessão do projeto
						setAuthenticatedProjectsSessions(authenticatedProjectsSessions.filter((session) => session.projectId !== projectId));

						// Disconecta os eventos do socket
						socket.off("error", onError);
						socket.off("connect_error", onConnectError);
						socket.off("connect", onConnect);
						socket.off("disconnect", onDisconnect);
						socket.off("subscribedToProject", onSubscribedToProject);
					}
				}

				/**
				 *
				 */
				function onSubscribedToProject() {
					const localProjectInstance = {
						projectName: response.data?.projectName,
						projectId: projectId,
						socket: socket,
					};

					// Adiciona a sessão do projeto
					setAuthenticatedProjectsSessions([...authenticatedProjectsSessions, localProjectInstance]);

					resolve({ success: true, localProjectInstance });
				}

				// Eventos do socket
				socket.on("error", onError); // Evento que roda quando ocorre um erro no socket
				socket.on("connect_error", onConnectError); // Evento que roda quando ocorre um erro ao conectar no socket
				socket.on("connect", onConnect); // Evento que roda quando a conexão é estabelecida
				socket.on("disconnect", onDisconnect); // Evento que roda quando a conexão é encerrada

				// Eventos do projeto
				socket.on("subscribedToProject", onSubscribedToProject); // Evento que roda quando o usuário se inscreve no projeto
			}
		});

		// Define que a participação no projeto está sendo validada
		projectsBeingValidated.current[projectId] = promise;

		return new Promise((resolve, reject) => {
			promise
				.finally(() => {
					projectsBeingValidated.current[projectId] = false;
				})
				.then((response) => resolve(response))
				.catch((error) => reject(error));
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
		const projectSession = isParticipating(projectId);
		if (projectSession == undefined) {
			return { success: false };
		}

		// Desconecta o socket do projeto
		const { socket } = projectSession;
		socket.emit("unsubscribeFromProject");

		try {
			socket.disconnect();
		} catch (error) {
			console.error(`Erro ao desconectar o socket: ${error.message}`);
		}

		return { success: true };
	}

	useEffect(() => {});

	return (
		<ProjectAuthenticationContext.Provider value={{ getProjectSession, participate, leave }}>{children}</ProjectAuthenticationContext.Provider>
	);
}
