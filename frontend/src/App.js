import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Registration from "./components/pages/registration/Registration";
import Login from "./components/pages/login/Login";
import HomeProjects from "./components/pages/home-projects/HomeProjects";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/cadastro" element={<Registration />} />
				<Route path="/login" element={<Login />} />
				<Route path="/home" element={<HomeProjects />} />
			</Routes>
		</Router>
	);
}

export default App;
