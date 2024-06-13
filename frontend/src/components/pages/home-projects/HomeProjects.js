import "./HomeProjects.css";

import { CreateProjectByUserEndpoint, DeleteProjectByProjectId, UpdateProjectAuthenticated } from "utilities/Endpoints";
import React, { useEffect, useRef, useState } from "react";
import { faCircleXmark, faUserLarge } from "@fortawesome/free-solid-svg-icons";

import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetProjectsByUserId } from "functionalities/GetProjectsByUserId";
import HeaderHome from "../../shared/login-registration/header-home/HeaderHome.js";
import TextInputField from "../../shared/text-input-field/TextInputField";
import { useAuthentication } from "context/AuthenticationContext";
import { useSystemPopups } from "context/popup/SystemPopupsContext";

function HomeProjects() {
	const { currentUserSession, performAuthenticatedRequest } = useAuthentication();
	const { newPopup } = useSystemPopups();

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDialogAddPhotoOpen, setAddPhotoDialog] = useState(false);
	const [isDialogOpenProjectOptions, setDialogOptionsOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [enteredProjectName, setProjectName] = useState("");
	const [getEnteredProjectDialog, setProjectDialog] = useState([]);
	const [projectNameUpdate, setProjectNameUpdate] = useState("");
	const [projects, setProjects] = useState([]);
	const [getUserName, setUserName] = useState(null);

	const fileInputRef = useRef(null);
	const projectNameReference = useRef(null);
	const projectNameUpdateReference = useRef(null);

	useEffect(() => {
		document.title = "Fluida | Home";

		fetchProjects();
	}, []);

	useEffect(() => {
		handleInputChange();
		handleInputChangeUpdateProjectName();
		handleUserName();
	});

	/**
	 * Carrega o username do usuário
	 */
	async function handleUserName() {
		if (currentUserSession) {
			const firstInitial = currentUserSession.firstName.charAt(0);
			const lastName = currentUserSession.lastName;
			const username = firstInitial + lastName;
			setUserName(username);
		}
	}

	/**
	 * Lida com o dialog de criar novo projeto
	 */
	function handleNewProjectClickDialog(boolean) {
		setIsDialogOpen(boolean);
		setProjectName("");
	}

	/**
	 * Lida com o dialog de adicionar foto ao usuário
	 */
	function handleDialogPhotoClick(boolean) {
		setAddPhotoDialog(boolean);
	}

	/**
	 * Lida com o dialog de opções do projeto
	 */
	function handleOptionsProjectClick(boolean, project) {
		setDialogOptionsOpen(boolean);
		setProjectDialog(project);
		setProjectNameUpdate("");
	}

	/**
	 * Busca os projetos relacionados ao id do usuário
	 */
	async function fetchProjects() {
		const response = await GetProjectsByUserId(performAuthenticatedRequest);
		if (response.success) {
			setProjects(response.data);
		} else {
			setProjects([]);
			console.log("Erro ao obter projetos:", response.error);
		}
	}

	/**
	 * Atualiza o valor do input de novo projeto
	 */
	async function handleInputChange() {
		if (projectNameReference.current) {
			const unsubscribe = projectNameReference.current.onTextChange((event) => {
				setProjectName(event.target.value);
			});

			return () => unsubscribe();
		}
	}

	/**
	 * Atualiza o valor do input de atualização do novo nome do projeto
	 */
	async function handleInputChangeUpdateProjectName() {
		if (projectNameUpdateReference.current) {
			const unsubscribe = projectNameUpdateReference.current.onTextChange((event) => {
				setProjectNameUpdate(event.target.value);
				console.log(projectNameUpdate);
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
				projectName: enteredProjectName,
			})
		);

		if (response.status === 201) {
			fetchProjects();
			newPopup("Common", { severity: "success", message: "Projeto criado com sucesso !" });
			setProjectName("");
			setIsDialogOpen(false);
		} else {
			newPopup("Common", {
				severity: "warning",
				message: "É necessário informar um nome para o projeto.",
			});
			console.log(response.data.message);
		}
	}

	/**
	 * Realiza a exclusão de um projeto
	 */
	async function handleOnDeleteProjectButton(projectId) {
		console.log(projectId);
		const response = await performAuthenticatedRequest(DeleteProjectByProjectId(projectId), "DELETE");

		if (response.status === 200) {
			fetchProjects();
			newPopup("Common", { severity: "error", message: "Projeto deletado com sucesso !" });
			setProjectNameUpdate("");
			setDialogOptionsOpen(false);
		} else {
			console.log(response.data.message);
		}
	}

	/**
	 * Realiza a atualização do nome do projeto
	 */
	async function handleOnUpdateProjectButton(projectId) {
		console.log(projectId);
		const response = await performAuthenticatedRequest(
			UpdateProjectAuthenticated(projectId),
			"PUT",
			JSON.stringify({
				projectName: projectNameUpdate,
			})
		);

		if (response.status === 200) {
			fetchProjects();
			newPopup("Common", {
				severity: "success",
				message: "Projeto atualizado com sucesso !",
			});
			setProjectNameUpdate("");
			setDialogOptionsOpen(false);
		} else {
			console.log(response.data.message);
		}
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
			<HeaderHome hideUsersInProject={true} />
			<div className={`HP-container-user-projects ${isDialogOpen || isDialogAddPhotoOpen ? "blur-background" : ""}`}>
				<div className="HP-container-user">
					<div className="HP-container-image-label">
						<i className="HP-user-image" onClick={() => handleDialogPhotoClick(true)}></i>
						<p className="HP-label">
							<span className="username-style">{`@${getUserName}`}</span>, bem-vindo de volta!
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
									<div key={project.projectId || index} className="HP-grid-item">
										<div
											className="HP-project-name"
											onClick={() => {
												document.location.href = `/project/${project.projectId}`;
											}}
										>
											{project.projectName}
										</div>
										<div onClick={() => handleOptionsProjectClick(true, project)} className="HP-project-options">
											<DotsIcon className="HP-header-icon" />
										</div>
									</div>
								))}
								<div className="HP-grid-item-new-project" onClick={() => handleNewProjectClickDialog(true)}>
									<div className="HP-container-new-project">
										<i className="HP-add-new-project"></i>
										<div className="HP-label-new-project">Criar novo projeto</div>
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
								onClick={() => handleNewProjectClickDialog(false)}
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
							<button className="HP-button-new-project" onClick={() => handleOnCreateProjectButton()}>
								Criar novo projeto
							</button>
						</div>
					</div>
				</div>
			)}

			{isDialogOpenProjectOptions && (
				<div className="HP-dialog-overlay">
					<div className="HP-dialog-update-name-project-container">
						<div className="HP-container-label-update-project-name">
							<div className="HP-container-label-current-name-project">
								<div>Nome atual do projeto:</div>
								<div className="HP-label-current-project-name">{getEnteredProjectDialog.projectName}</div>
							</div>
							<div className="HP-container-close-dialog-project-update">
								<FontAwesomeIcon
									onClick={() => handleOptionsProjectClick(false)}
									icon={faCircleXmark}
									size="xl"
									style={{
										color: "#8c8c8c",
										cursor: "pointer",
										borderRadius: "50%",
									}}
								/>
							</div>
						</div>
						<div>
							<TextInputField
								style={{
									marginTop: "10px",
									marginBottom: "10px",
									borderRadius: "var(--border-radius)",
									backgroundColor: "rgb(244, 244, 244)",
								}}
								name="projectUpdate"
								placeholder="Novo nome do projeto"
								ref={projectNameUpdateReference}
							/>
						</div>
						<div className="HP-container-buttons-update-project">
							<button
								className={`HP-button-update-project ${projectNameUpdate.length <= 0 ? "HP-button-update-project-disabled" : ""}`}
								onClick={() => handleOnUpdateProjectButton(getEnteredProjectDialog.projectId)}
								disabled={projectNameUpdate.length <= 0}
							>
								Atualizar projeto
							</button>
							<button
								className="HP-button-delete-project"
								onClick={() => handleOnDeleteProjectButton(getEnteredProjectDialog.projectId)}
							>
								Excluir projeto
							</button>
						</div>
					</div>
				</div>
			)}

			{isDialogAddPhotoOpen && (
				<div className="HP-dialog-overlay">
					<div className="HP-container-user-photo">
						<div className="HP-container-close-user-photo">
							<FontAwesomeIcon
								onClick={() => handleDialogPhotoClick(false)}
								icon={faCircleXmark}
								size="xl"
								style={{ color: "#8c8c8c", cursor: "pointer", borderRadius: "50%" }}
							/>
						</div>

						<div className="HP-container-username-label">
							<div className="HP-username-label">
								<span className="HP-hello">Olá,</span> <span className="username-style">{`@${getUserName}`}</span>
							</div>
							<div className="HP-welcome">Seja bem-vindo ao Fluida.</div>
						</div>

						<div className="HP-container-photo">
							<div className="HP-user-photo-container" onClick={handleDivClick}>
								{selectedImage ? (
									<img src={selectedImage} alt="Selected" className="photoSelected" />
								) : (
									<FontAwesomeIcon icon={faUserLarge} style={{ color: "#e4e4e4" }} className="photo" />
								)}

								<input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} ref={fileInputRef} />
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
