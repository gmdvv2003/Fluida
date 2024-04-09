import "./HomeProjects.css";

import HeaderHome from "../../shared/login-registration/header-home/HeaderHome.js";

function HomeProjects() {
	const username = "variableUserName"
	return (
		<div className="teste">
			<HeaderHome />
			<div className="HP-container-user-projects">
				<div className="HP-container-user">
					<div className="HP-container-image-label">
						<i className="HP-user-image"></i>
						<p className="HP-label">
                            <span className="username-style">{`@${username}`}</span>, bem-vindo de volta!
                        </p>
					</div>
				</div>
				<div className="HP-container-projects">
					<div className="HP-container-label-your-projects">
						Seus projetos
					</div>
					<div className="HP-container-project">

					</div>
				</div>
			</div>
		</div>
	);
}

export default HomeProjects;
