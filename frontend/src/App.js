import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Registration from "./components/pages/registration/Registration";
import Login from "./components/pages/login/Login";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/cadastro" element={<Registration />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</Router>
	);
}

export default App;
