import url from "url";

const OPTIONS = {
	protocol: "http",
	hostname: "localhost",
	port: 8080,
};

const SETTINGS = {
	headers: { "Content-Type": "application/json" },
	mode: "cors",
	cache: "no-cache",
	credentials: "same-origin",
};

class Endpoint {
	static new(path, options = []) {
		const formattedUrl = url.format({
			...OPTIONS,
			...options,
			pathname: path,
		});

		return async (method, body, header = []) => {
			return await new Promise((resolve, _) => {
				fetch(formattedUrl, {
					...SETTINGS,
					headers: { ...SETTINGS.headers, ...header },
					method: method,
					body: body,
				})
					.then(async (result) => {
						const { ok, status } = result;
						return resolve({ success: ok, status: status, data: await result.json() });
					})
					.catch((error) => resolve({ success: false, error: error }));
			});
		};
	}
}

class FunctionlessEndpoint {
	static new(path, options = []) {
		return url.format({
			...OPTIONS,
			...options,
			pathname: path,
		});
	}
}

// Login & Logout
export const PerformLoginEndpoint = Endpoint.new("/users/login");
export const PerformLogoutEndpoint = Endpoint.new("/users/logout");

// Validação de Email
export const ValidateEmailEndpoint = Endpoint.new("/users/validateEmail");
export const RequestValidationEmailEndpoint = Endpoint.new("/users/requestValidationEmail");

// Reset da Senha
export const RequestPasswordResetEndpoint = Endpoint.new("/users/requestPasswordReset");
export const ResetPasswordEndpoint = Endpoint.new("/users/resetPassword");

// Registration
export const RegisterUserEndpoint = Endpoint.new("/users/register");
export const IsEmailInUseEndpoint = Endpoint.new("/users/isEmailInUse");

// Project
export const CreateProjectByUserEndpoint = Endpoint.new("/projects/createProject");
export const GetProjectsByUserIdEndpoint = Endpoint.new("/projects/getProjectsOfUser");
export const UpdateProjectAuthenticated = (projectId) => Endpoint.new(`/projects/updateProject/${projectId}`);
export const DeleteProjectByProjectId = (projectId) => Endpoint.new(`/projects/deleteProject/${projectId}`);

// Participate
export const ParticipateInProjectEndpoint = Endpoint.new("/projects/participate");

// Project Invitations
export const AcceptProjectInvitationEndpoint = Endpoint.new("/projects/validateInvite");

// Projects Socket Endpoint
export const ProjectsSocketEndpoint = FunctionlessEndpoint.new("/projects");
