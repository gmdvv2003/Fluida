import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";

import { AuthenticationProvider } from "context/AuthenticationContext";
import { ProjectAuthenticationProvider } from "context/ProjectAuthenticationContext";
import { SystemPopupsProvider } from "context/popup/SystemPopupsContext";

import PrivateRoute from "functionalities/PrivateRoute";
import ParticipateInProject from "functionalities/ParticipateInProject";
import LoginRoutePrivacy from "functionalities/LoginRoutePrivacy";
import LoginRedirect from "functionalities/LoginRedirect";

import Loading from "components/shared/loading/Loading";
import Configurations from "components/pages/configurations/Configurations";

const Registration = lazy(() => import("components/pages/registration/Registration"));
const Login = lazy(() => import("components/pages/login/Login"));
const SendPasswordReset = lazy(() => import("components/pages/login-password-reset/SendPasswordReset"));
const LoginPasswordReset = lazy(() => import("components/pages/login-password-reset/LoginPasswordReset"));
const ValidateEmail = lazy(() => import("components/pages/validate-email/ValidateEmail"));

const HomeProjects = lazy(() => import("components/pages/home-projects/HomeProjects"));
const Project = lazy(() => import("components/pages/project/Project"));
const LandingPage = lazy(() => import("components/pages/landing-page/LandingPage"));
const AcceptProjectInvitation = lazy(() =>
	import("components/pages/accept-project-invitation/AcceptProjectInvitation")
);
const RequestValidationEmail = lazy(() => import("components/pages/request-validation-email/RequestValidationEmail"));

function App() {
	return (
		<SystemPopupsProvider>
			<AuthenticationProvider>
				<ProjectAuthenticationProvider>
					<BrowserRouter>
						<LoginRedirect />
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
									<LoginRoutePrivacy>
										<Suspense fallback={<Loading />}>
											<Login />
										</Suspense>
									</LoginRoutePrivacy>
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

							<Route
								path="/request-validation-email"
								element={
									<Suspense fallback={<Loading />}>
										<RequestValidationEmail />
									</Suspense>
								}
							/>

							{/* Rotas Seguras */}
							<Route
								path="/home"
								element={
									<PrivateRoute>
										<Suspense fallback={<Loading />}>
											<HomeProjects />
										</Suspense>
									</PrivateRoute>
								}
							/>

							<Route
								path="/configurations"
								element={
									<PrivateRoute redirectAutomatically={true}>
										<Suspense fallback={<Loading />}>
											<Configurations />
										</Suspense>
									</PrivateRoute>
								}
							/>

							<Route
								path="/project/:projectId/:cardId?"
								element={
									<PrivateRoute redirectAutomatically={true}>
										<Suspense fallback={<Loading />}>
											<Project />
										</Suspense>
									</PrivateRoute>
								}
							/>

							<Route
								path="/validate-project-invite"
								element={
									<PrivateRoute redirectAutomatically={true}>
										<AcceptProjectInvitation>
											<Suspense fallback={<Loading />}>
												<Project />
											</Suspense>
										</AcceptProjectInvitation>
									</PrivateRoute>
								}
							/>
						</Routes>
					</BrowserRouter>
				</ProjectAuthenticationProvider>
			</AuthenticationProvider>
		</SystemPopupsProvider>
	);
}

export default App;
