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

		return async (method, body = [], header = []) => {
			return await new Promise((resolve, _) => {
				fetch(formattedUrl, {
					...SETTINGS,
					headers: { ...SETTINGS.headers, ...header },
					method: method,
					body: body,
				})
					.then((result) => result.json())
					.then((result) => resolve({ success: true, data: result }))
					.catch((error) => resolve({ success: false, error: error }));
			});
		};
	}
}

// Login & Logout
export const PerformLoginEndpoint = Endpoint.new("/users/login");
export const PerformLogoutEndpoint = Endpoint.new("/users/logout");

// Validação de Email
export const ValidateEmailEndpoint = Endpoint.new("/users/validateEmail");

// Reset da Senha
export const RequestPasswordResetEndpoint = Endpoint.new("/users/requestPasswordReset");
export const ResetPasswordEndpoint = Endpoint.new("/users/resetPassword");

// Registration
export const RegisterUserEndpoint = Endpoint.new("/users/register");
