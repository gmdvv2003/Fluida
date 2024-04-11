import "./HomeProjects.css";

import HeaderHome from "../../shared/login-registration/header-home/HeaderHome.js";

function HomeProjects() {
	const username = "variableUserName"
	const projects = [
		{
			projectName: "Projeto 1"

		},
		{
			projectName: "Projeto 2"

		},
		{
			projectName: "Projeto 3"

		},
		{
			projectName: "Projeto 4"

		},
		{
			projectName: "Projeto 1"

		},
		{
			projectName: "Projeto 2"

		},
		{
			projectName: "Projeto 3"

		},
		{
			projectName: "Projeto 4"

		},
		
	];
	
	return (
		<div>
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
						<div className="HP-label">Seus projetos</div>
					</div>
					<div className="HP-container-project">
						<div className="HP-project">
							<div className="HP-grid-container">
								{projects.map((project, index) => (
                                    <div key={index} className="HP-grid-item">
                                        {project.projectName}
                                    </div>
                                ))}
								<div className="HP-grid-item">
									<div className="HP-container-new-project">
										<i className="HP-add-new-project"></i>
										<div className="HP-label-new-project">
											Criar novo projeto
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HomeProjects;
