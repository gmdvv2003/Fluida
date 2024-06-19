import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Logo } from "assets/icons/fluida-logo.svg";

import ConfigurationModal from "../configuration-modal/ConfigurationModal";
import UserIcon from "components/shared/user-icon/UserIcon";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonDigging, faUserLarge } from '@fortawesome/free-solid-svg-icons';

import "./HeaderHome.css";

function HeaderHome({ hideSearchBar, hideUsersInProject, onUsersInProjectClick }) {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [isHoveredConstruction, setIsHoveredConstruction] = useState(false);
	const [isHoveredSettings, setIsHoveredSettings] = useState(false);

	// Para retornar a página home
	const navigate = useNavigate();

	function toggleModal() {
		setModalIsOpen(!modalIsOpen);
	}

	useEffect(() => {
		function mouseMove(event) {
            const { clientX, clientY } = event;

            if (modalIsOpen) {
                const modal = document.querySelector(".CM-fluida-container");
                if (!modal) {
                    return null;
                }

                const { x, y, height } = modal.getBoundingClientRect();

                if (clientX < x || clientY > y + height) {
                    setModalIsOpen(false);
                }
            }
        }

		document.addEventListener("mousemove", mouseMove);

		return () => {
			document.removeEventListener("mousemove", mouseMove);
		};
	});

	return (
		<div>
			<div className="HH-header-home-container">
				<div className="HH-container-logo">
					<Logo
						className="HH-header-home-logo"
						onClick={() => {
							navigate("/home");
						}}
					/>
				</div>
				<div className="HH-input-buttons">
					{!hideSearchBar ? (
						<div className="HH-input-container">
							<input className="HH-input-search" type="text" autoComplete="off" />
							<i className="HH-icon-search" />
						</div>
					) : (
						<div className="HH-input-container" />
					)}
					<div className="HH-buttons-container">
						{!hideUsersInProject && (
							<div className="HH-buttons-container">
								<div className="HH-userIcons-container">
									<FontAwesomeIcon icon={faUserLarge} style={{ color: "#ffffff" }} className="HH-icon-person" size="xl"/>
									<FontAwesomeIcon icon={faUserLarge} style={{ color: "#ffffff" }} className="HH-icon-person" size="xl"/>
									<FontAwesomeIcon icon={faUserLarge} style={{ color: "#ffffff" }} className="HH-icon-person" size="xl"/>
									<FontAwesomeIcon icon={faUserLarge} style={{ color: "#ffffff" }} className="HH-icon-person" size="xl"/>
								</div>
								<i className="HH-user-in-project-icon" onClick={onUsersInProjectClick} />
							</div>
						)}

						<div
							className="HH-icon-construction"
							onMouseEnter={() => setIsHoveredConstruction(true)}
							onMouseLeave={() => setIsHoveredConstruction(false)}
						>
							{isHoveredConstruction ? (
								<div>
									<FontAwesomeIcon icon={faPersonDigging} style={{ color: "#c9c9c9" }} size="lg" />
								</div>
							) : (
								<div>
									<i className="HH-bell-icon" />
								</div>
							)}
						</div>
						<div
							className="HH-icon-construction"
							onMouseEnter={() => setIsHoveredSettings(true)}
							onMouseLeave={() => setIsHoveredSettings(false)}
						>
							{isHoveredSettings ? (
								<div>
									<FontAwesomeIcon icon={faPersonDigging} style={{ color: "#c9c9c9" }} size="lg" />
								</div>
							) : (
								<div>
									<i className="HH-settings-icon" />
								</div>
							)}
						</div>

						<i className="HH-photo-icon" onClick={toggleModal} />
					</div>
				</div>
			</div>
			{modalIsOpen && <ConfigurationModal />}
		</div>
	);
}

export default HeaderHome;
