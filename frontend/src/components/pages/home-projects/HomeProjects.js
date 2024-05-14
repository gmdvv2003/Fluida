import "./HomeProjects.css";

import React, { useRef, useState } from "react";
import { faCircleXmark, faUserLarge } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditCard from "../project/templates/edit-card/EditCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeaderHome from "../../shared/login-registration/header-home/HeaderHome.js";
import TextInputField from "../../shared/text-input-field/TextInputField";
import TextInputField from "../../shared/text-input-field/TextInputField";

function HomeProjects() {
	const username = "variableUserName";
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDialogAddPhotoOpen, setAddPhotoDialogOpen] = useState(true);
	const [selectedImage, setSelectedImage] = useState(null);
	const fileInputRef = useRef(null);

	const projects = [
		{ projectName: "Projeto 1" },
		{ projectName: "Projeto 2" },
		{ projectName: "Projeto 3" },
		{ projectName: "Projeto 4" },
		{ projectName: "Projeto 1" },
		{ projectName: "Projeto 2" },
		{ projectName: "Projeto 3" },
		{ projectName: "Projeto 4" },
		{ projectName: "Projeto 1" },
		{ projectName: "Projeto 2" },
		{ projectName: "Projeto 3" },
		{ projectName: "Projeto 4" },
		{ projectName: "Projeto 1" },
		{ projectName: "Projeto 2" },
		{ projectName: "Projeto 3" },
		{ projectName: "Projeto 4" },
		{ projectName: "Projeto 1" },
		{ projectName: "Projeto 2" },
		{ projectName: "Projeto 3" },
		{ projectName: "Projeto 4" },
		{ projectName: "Projeto 1" },
		{ projectName: "Projeto 2" },
		{ projectName: "Projeto 3" },
		{ projectName: "Projeto 4" },
		{ projectName: "Projeto 2" },
		{ projectName: "Projeto 3" },
		{ projectName: "Projeto 4" },
		{ projectName: "Projeto 1" },
		{ projectName: "Projeto 2" },
		{ projectName: "Projeto 3" },
		{ projectName: "Projeto 4" },
		{ projectName: "Projeto 1" },
		{ projectName: "Projeto 2" },
		{ projectName: "Projeto 3" },
		{ projectName: "Projeto 4" },
		{ projectName: "Projeto 1" },
		{ projectName: "Projeto 2" },
		{ projectName: "Projeto 3" },
		{ projectName: "Projeto 4" },
	];
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
	}
		setIsDialogOpen(true);
	}

	function handleCloseDialog() {
		setIsDialogOpen(false);
	}
		setIsDialogOpen(false);
	}

	function handleAddPhotoClick() {
	function handleAddPhotoClick() {
		setAddPhotoDialogOpen(true);
	}

	function handleCloseDialogAddPhoto() {
		setAddPhotoDialogOpen(false);
	}
		setAddPhotoDialogOpen(false);
	}

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedImage(reader.result);
			};
			reader.readAsDataURL(file);
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

	useEffect(() => {
		document.title = "Fluida | Home";
	});

	return (
		<div>
			<HeaderHome />
			<div
				className={`HP-container-user-projects ${
					isDialogOpen || isDialogAddPhotoOpen ? "blur-background" : ""
				}`}
			>
			<EditCard />
			{/* <div
				className={`HP-container-user-projects ${
					isDialogOpen || isDialogAddPhotoOpen ? "blur-background" : ""
				}`}
			>
				<div className="HP-container-user">
					<div className="HP-container-image-label">
						<i className="HP-user-image" onClick={handleAddPhotoClick}></i>
						<p className="HP-label">
							<span className="username-style">{`@${username}`}</span>, bem-vindo de
							volta!
						</p>
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
								{projects.map((project) => (
									<div key={project} className="HP-grid-item">
										<div className="HP-project-name">{project.projectName}</div>
									</div>
								))}
								<div
									className="HP-grid-item-new-project"
									onClick={handleNewProjectClick}
								>
									<div key={project} className="HP-grid-item">
										<div className="HP-project-name">{project.projectName}</div>
									</div>
								))}
								<div
									className="HP-grid-item-new-project"
									onClick={handleNewProjectClick}
								>
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
							/>
						</div>
						<div className="HP-container-button-new-project">
							<button className="HP-button-new-project">Criar novo projeto</button>
						</div>
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
							/>
						</div>
						<div className="HP-container-button-new-project">
							<button className="HP-button-new-project">Criar novo projeto</button>
						</div>
					</div>
				</div>
			)}
			)}
			{isDialogAddPhotoOpen && (
				<div className="HP-dialog-overlay">
				<div className="HP-dialog-overlay">
					<div className="HP-container-user-photo">
						<div className="HP-container-close-user-photo">
							<FontAwesomeIcon
								onClick={handleCloseDialogAddPhoto}
								icon={faCircleXmark}
								size="xl"
								style={{ color: "#8c8c8c", cursor: "pointer", borderRadius: "50%" }}
							/>
							<FontAwesomeIcon
								onClick={handleCloseDialogAddPhoto}
								icon={faCircleXmark}
								size="xl"
								style={{ color: "#8c8c8c", cursor: "pointer", borderRadius: "50%" }}
							/>
						</div>
						<div className="HP-container-username-label">
							<div className="HP-username-label">
								<span className="HP-hello">Olá,</span>{" "}
								<span className="username-style">{`@${username}`}</span>
								<span className="HP-hello">Olá,</span>{" "}
								<span className="username-style">{`@${username}`}</span>
							</div>
							<div className="HP-welcome">Seja bem-vindo ao Fluida.</div>
							<div className="HP-welcome">Seja bem-vindo ao Fluida.</div>
						</div>
						<div className="HP-container-photo">
							<div className="HP-user-photo-container">
								<div className="HP-user-photo" onClick={handleDivClick}>
								<div className="HP-user-photo" onClick={handleDivClick}>
									{selectedImage ? (
										<img
											src={selectedImage}
											alt="Selected"
											className="photoSelected"
										/>
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
										<FontAwesomeIcon
											icon={faUserLarge}
											style={{ color: "#e4e4e4" }}
											className="photo"
										/>
									)}
								</div>
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									style={{ display: "none" }}
									style={{ display: "none" }}
									ref={fileInputRef}
								/>
							</div>
							<div className="HP-label-new-photo">Adicione uma foto.</div>
							<div className="HP-label-new-photo">Adicione uma foto.</div>
						</div>
						<div className="HP-container-button-add-photo">
							<button className="HP-button-add-photo">Continuar</button>
						</div>
					</div>
				</div>
			)}
			)} */}
		</div>
	);
}

export default HomeProjects;

