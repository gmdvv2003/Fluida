import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthenticationProvider } from "context/AuthenticationContext";
import { ProjectAuthenticationProvider } from "context/ProjectAuthenticationContext";

import PrivateRoute from "functionalities/PrivateRoute";
import ParticipateInProject from "functionalities/ParticipateInProject";

import Loading from "components/shared/loading/Loading";

const Registration = lazy(() => import("components/pages/registration/Registration"));
const Login = lazy(() => import("components/pages/login/Login"));
const SendPasswordReset = lazy(() =>
	import("components/pages/login-password-reset/SendPasswordReset")
);
const LoginPasswordReset = lazy(() =>
	import("components/pages/login-password-reset/LoginPasswordReset")
);
const ValidateEmail = lazy(() => import("components/pages/validate-email/ValidateEmail"));

const HomeProjects = lazy(() => import("components/pages/home-projects/HomeProjects"));
const Project = lazy(() => import("components/pages/project/Project"));
const LandingPage = lazy(() => import("components/pages/landing-page/LandingPage"));

function App() {
	return (
		<AuthenticationProvider>
			<ProjectAuthenticationProvider>
				<BrowserRouter>
					<Routes>
						{/* Rotas Públicas */}
						<Route
							path="*"
							element={
								<Suspense fallback={<Loading />}>
									<LandingPage />
								</Suspense>
							}
						/>

						<Route
							path="/registration"
							element={
								<Suspense fallback={<Loading />}>
									<Registration />
								</Suspense>
							}
						/>

						<Route
							path="/login"
							element={
								<Suspense fallback={<Loading />}>
									<Login />
								</Suspense>
							}
						/>

						<Route
							path="/send-password-reset"
							element={
								<Suspense fallback={<Loading />}>
									<SendPasswordReset />
								</Suspense>
							}
						/>

						<Route
							path="/reset-password"
							element={
								<Suspense fallback={<Loading />}>
									<LoginPasswordReset />
								</Suspense>
							}
						/>

						<Route
							path="/validate-email"
							element={
								<Suspense fallback={<Loading />}>
									<ValidateEmail />
								</Suspense>
							}
						/>

						{/* Rotas Seguras */}
						<Route
							path="/home"
							element={
								<PrivateRoute>
									<HomeProjects />
								</PrivateRoute>
							}
						/>

						<Route
							path="/project/:projectId/:cardId?"
							element={
								// <PrivateRoute>
								<ParticipateInProject>
									<Project />
								</ParticipateInProject>
								// </PrivateRoute>
							}
						/>
					</Routes>
				</BrowserRouter>
			</ProjectAuthenticationProvider>
		</AuthenticationProvider>
	);
}

export default App;
