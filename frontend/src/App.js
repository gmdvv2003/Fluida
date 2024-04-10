import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import HomeProjects from "./components/pages/home-projects/HomeProjects";
import Login from "./components/pages/login/Login";
import LoginPasswordReset from "components/pages/login-password-reset/LoginPasswordReset";
import Registration from "./components/pages/registration/Registration";
import SendPasswordReset from "components/pages/login-password-reset/SendPasswordReset";
import ValidateEmail from "components/pages/validate-email/ValidateEmail";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/registration" element={<Registration />} />
				<Route path="/login" element={<Login />} />
				<Route path="/send-password-reset" element={<SendPasswordReset />} />
				<Route path="/reset-password" element={<LoginPasswordReset />} />
				<Route path="/validate-email" element={<ValidateEmail />} />
				<Route path="/home" element={<HomeProjects />} />
			</Routes>
		</Router>
	);
}

export default App;
