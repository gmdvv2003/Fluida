import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/pages/registration/Registration";
import Login from "./components/pages/login/Login";
import HomeProjects from "./components/pages/home-projects/HomeProjects";
import SendPasswordReset from "components/pages/login-password-reset/SendPasswordReset";
import LoginPasswordReset from "components/pages/login-password-reset/LoginPasswordReset";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/registration" element={<Registration />} />
				<Route path="/login" element={<Login />} />
				<Route path="/send-password-reset" element={<SendPasswordReset />} />
				<Route path="/reset-password" element={<LoginPasswordReset />} />
				<Route path="/home" element={<HomeProjects />} />
			</Routes>
		</Router>
	);
}

export default App;
