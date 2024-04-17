import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthenticationProvider } from "context/AuthenticationContext";

import Registration from "components/pages/registration/Registration";
import Login from "components/pages/login/Login";
import SendPasswordReset from "components/pages/login-password-reset/SendPasswordReset";
import LoginPasswordReset from "components/pages/login-password-reset/LoginPasswordReset";
import ValidateEmail from "components/pages/validate-email/ValidateEmail";
import HomeProjects from "components/pages/home-projects/HomeProjects";

import PrivateRoute from "functionalities/PrivateRoute";
import Project from "components/pages/project/Project";

function App() {
	return (
		<AuthenticationProvider>
			<BrowserRouter>
				<Routes>
					{/* Rotas Públicas */}
					<Route path="/registration" element={<Registration />} />
					<Route path="/login" element={<Login />} />
					<Route path="/send-password-reset" element={<SendPasswordReset />} />
					<Route path="/reset-password" element={<LoginPasswordReset />} />
					<Route path="/validate-email" element={<ValidateEmail />} />

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
						path="/project"
						element={
							// <PrivateRoute>
							<Project />
							// </PrivateRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</AuthenticationProvider>
	);
}

export default App;
