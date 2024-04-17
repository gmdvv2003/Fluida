import "./HomeProjects.css";

import React, { useState } from "react";
import { faCircleXmark, faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeaderHome from "../../shared/login-registration/header-home/HeaderHome.js";
import TextInputField from "../../shared/text-input-field/TextInputField"

function HomeProjects() {
	const username = "variableUserName";
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDialogAddPhotoOpen, setAddPhotoDialogOpen] = useState(true);
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

	function handleNewProjectClick() {
        setIsDialogOpen(true);
    };

	function handleCloseDialog() {
        setIsDialogOpen(false);
    };

	function handleAddPhotoClick(){
		setAddPhotoDialogOpen(true);
	}

	function handleCloseDialogAddPhoto() {
        setAddPhotoDialogOpen(false);
    };
	
	return (
		<div>
			<HeaderHome />
			<div className={`HP-container-user-projects ${isDialogOpen || isDialogAddPhotoOpen ? 'blur-background' : ''}`}>
				<div className="HP-container-user">
					<div className="HP-container-image-label">
						<i className="HP-user-image" onClick={handleAddPhotoClick}></i>
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
			{isDialogAddPhotoOpen && (
				<div className="HP-container-user-photo">          
					<div className="HP-container-close-user-photo">
						<FontAwesomeIcon onClick={handleCloseDialogAddPhoto} icon={faCircleXmark} size="xl" style={{color: "#8c8c8c", cursor: "pointer", borderRadius: "50%"}} />
					</div>
					<div className="HP-container-username-label">			
						<div className="HP-username-label">			
							<span className="HP-hello">Olá,</span> <span className="username-style">{`@${username}`}</span>
						</div>
						<div className="HP-welcome">			
							Seja bem-vindo ao Fluida.
						</div>
					</div>
					<div className="HP-container-photo">			
						<div className="HP-user-photo-container">			
							<div className="HP-user-photo">
								<FontAwesomeIcon icon={faUserPlus} size="2xl" style={{color: "#8c8c8c", width: "100%", display: "flex"}}/>
							</div>
						</div>
						<div className="HP-label-new-photo">			
							Adicione uma foto.
						</div>
					</div>
					<div className="HP-container-button-add-photo">			
						<button className="HP-button-add-photo">Continuar</button>
					</div>
				</div>
            )}
		</div>
	);
}

export default HomeProjects;