import "./HomeProjects.css";

import React, { useEffect, useRef, useState } from "react";
import { faCircleXmark, faUserLarge } from "@fortawesome/free-solid-svg-icons";

import { CreateProjectByUserEndpoint } from "utilities/Endpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetProjectsByUserId } from "functionalities/GetProjectsByUserId";
import HeaderHome from "../../shared/login-registration/header-home/HeaderHome.js";
import TextInputField from "../../shared/text-input-field/TextInputField";
import { useAuthentication } from "context/AuthenticationContext";

function HomeProjects() {

	const { currentUserSession, performAuthenticatedRequest } = useAuthentication();

	const username = "variableUserName";

	const [isDialogOpen, setIsDialogOpen] = 				useState(false);
	const [isDialogAddPhotoOpen, setAddPhotoDialog] = 	useState(false);
	const [selectedImage, setSelectedImage] = 				useState(null);
	const [enteredProjectName, setProjectName] = 			useState("");
	const [projects, setProjects] = 						useState([]);

	// const hasFetchedProjects = 		useRef(false);
	const fileInputRef = 			useRef(null);
	const projectNameReference = 	useRef(null);
	

	useEffect(() => {
		
        document.title = "Fluida | Home";

		fetchProjects();

    }, []);

	useEffect(() => {

		handleInputChange();

    });

	function handleNewProjectClick() {
		setIsDialogOpen(true);
	}


	function handleCloseDialog() {
		setIsDialogOpen(false);
	}

	/**
	 * Abre o dialog de adicionar foto ao usuário
	 */
	function handleAddPhotoClick(boolean) {
		setAddPhotoDialog(boolean);
	}

	/**
	 * Busca os projetos relacionados ao id do usuário
	 */
	async function fetchProjects() {
		const response = await GetProjectsByUserId(performAuthenticatedRequest);
		if (response.success) {
			setProjects(response.data);
		} else {
			console.log("Erro ao obter projetos:", response.error);
		}
	}

	/**
	 * Atualiza o valor do input de novo projeto
	 */
	async function handleInputChange(){
		if (projectNameReference.current) {
            const unsubscribe = projectNameReference.current.onTextChange((event) => {
                setProjectName(event.target.value);
				console.log(enteredProjectName)
            });

            return () => unsubscribe();
        }
	}

	/**
	 * Realiza o cadastro de um projeto para o usuário logado
	 */
	async function handleOnCreateProjectButton() {
		
		const response = await performAuthenticatedRequest(
			CreateProjectByUserEndpoint,
			"POST",
			JSON.stringify({ 
				userId: currentUserSession.userId, projectName: enteredProjectName 
			})
		);
		
		console.log(response.data.message)

	}

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDivClick = () => {
		// Simulate click on file input when the div is clicked
		fileInputRef.current.click();
	};

	return (
		<div>
			<HeaderHome />
			<div
				className={`HP-container-user-projects ${
					isDialogOpen || isDialogAddPhotoOpen ? "blur-background" : ""
				}`}
			>
				<div className="HP-container-user">
					<div className="HP-container-image-label">
						<i className="HP-user-image" onClick={() => handleAddPhotoClick(true)}></i>
						<p className="HP-label">
							<span className="username-style">{`@${username}`}</span>, bem-vindo de
							volta!
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
									<div key={project.id || index} className="HP-grid-item">
										<div className="HP-project-name">{project.projectName}</div>
									</div>
								))}
								<div className="HP-grid-item-new-project" onClick={handleNewProjectClick}>
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
				<div className="HP-dialog-overlay">
					<div className="HP-dialog-new-project-container">
						<div className="HP-container-close-dialog">
							<FontAwesomeIcon
								onClick={handleCloseDialog}
								icon={faCircleXmark}
								size="xl"
								style={{ color: "#8c8c8c", cursor: "pointer", borderRadius: "50%" }}
							/>
						</div>
						<div>
							<TextInputField
								style={{
									marginTop: "10px",
									marginBottom: "10px",
									borderRadius: "var(--border-radius)",
									backgroundColor: "rgb(244, 244, 244)",
								}}
								name="project"
								placeholder="Nome do projeto"
								ref={projectNameReference}
							/>
						</div>
						<div className="HP-container-button-new-project">
							<button className="HP-button-new-project" onClick={() => handleOnCreateProjectButton()}>Criar novo projeto</button>
						</div>
					</div>
				</div>
			)}
			{isDialogAddPhotoOpen && (
				<div className="HP-dialog-overlay">
					<div className="HP-container-user-photo">
						<div className="HP-container-close-user-photo">
							<FontAwesomeIcon
								onClick={() => handleAddPhotoClick(false)}
								icon={faCircleXmark}
								size="xl"
								style={{ color: "#8c8c8c", cursor: "pointer", borderRadius: "50%" }}
							/>
						</div>
						<div className="HP-container-username-label">
							<div className="HP-username-label">
								<span className="HP-hello">Olá,</span>{" "}
								<span className="username-style">{`@${username}`}</span>
							</div>
							<div className="HP-welcome">Seja bem-vindo ao Fluida.</div>
						</div>
						<div className="HP-container-photo">
							<div className="HP-user-photo-container" onClick={handleDivClick}>
								{selectedImage ? (
									<img
										src={selectedImage}
										alt="Selected"
										className="photoSelected"
									/>
								) : (
									<FontAwesomeIcon
										icon={faUserLarge}
										style={{ color: "#e4e4e4" }}
										className="photo"
									/>
								)}
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									style={{ display: "none" }}
									ref={fileInputRef}
								/>
							</div>
							<div className="HP-label-new-photo">Adicione uma foto.</div>
						</div>
						<div className="HP-container-button-add-photo">
							<button className="HP-button-add-photo">Continuar</button>
						</div>
					</div>
				</div>
			)} 
		</div>
	);
}

export default HomeProjects;
