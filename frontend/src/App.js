import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Cadastro from "./componentes/cadastro/Cadastro.js";
import Login from "./componentes/login/Login.js";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/cadastro" element={<Cadastro />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</Router>
	);
}

export default App;
