import "./HomeProjects.css";

import React, { useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderHome from "../../shared/login-registration/header-home/HeaderHome.js";
import TextInputField from "../../shared/text-input-field/TextInputField"
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

function HomeProjects() {
	const username = "variableUserName";
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const projects = [
        { projectName: "Projeto 1" },
        { projectName: "Projeto 2" },
        { projectName: "Projeto 3" },
        { projectName: "Projeto 4" },
        { projectName: "Projeto 1" },
        { projectName: "Projeto 2" },
        { projectName: "Projeto 3" },
        { projectName: "Projeto 4" },
    ];

	function handleNewProjectClick () {
        setIsDialogOpen(true);
    };

	function handleCloseDialog() {
        setIsDialogOpen(false);
    };
	
	return (
		<div>
			<HeaderHome />
			<div className={`HP-container-user-projects ${isDialogOpen ? 'blur-background' : ''}`}>
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
								{projects.map((project) => (
                                    <div key={project} className="HP-grid-item">
                                        {project.projectName}
                                    </div>
                                ))}
								<div className="HP-grid-item" onClick={handleNewProjectClick}>
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
			{isDialogOpen && (
                <div className="HP-dialog-new-project-container">
                    <div className="HP-container-close-dialog">
						<FontAwesomeIcon onClick={handleCloseDialog} icon={faCircleXmark} size="xl" style={{color: "#8c8c8c", cursor: "pointer", borderRadius: "50%"}} />
					</div>
					<div>			
						<TextInputField 
							style={{
								marginTop: "10px",
								marginBottom: "10px"
							}}
							name="project"
							placeholder="Nome do projeto"
						/>
					</div>
					<div className="HP-container-button-new-project">	
						<button className="HP-button-new-project">Criar novo projeto</button>		
					</div>
                </div>
            )}
		</div>
	);
}

export default HomeProjects;
