import { useEffect, useState } from "react";

import "./HeaderHome.css";

import ConfigurationModal from "../configuration-modal/ConfigurationModal";
import { ReactComponent as Logo } from "assets/icons/fluida-logo.svg";

function HeaderHome({ hideSearchBar }) {
	const [modalIsOpen, setModalIsOpen] = useState(false);

	function toggleModal() {
		setModalIsOpen(!modalIsOpen);
	}

	useEffect(() => {
		function mouseMove(event) {
			const { clientX, clientY } = event;

			if (modalIsOpen) {
				const modal = document.querySelector(".CM-fluida-container");
				const modalRect = modal.getBoundingClientRect();

				if (clientX < modalRect.x || clientY > modalRect.y + modalRect.height) {
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
					<Logo className="HH-header-home-logo" />
				</div>
				<div className="HH-input-buttons">
					{!hideSearchBar ? (
						<div className="HH-input-container">
							<input className="HH-input-search" type="text" />
							<i className="HH-icon-search" />
						</div>
					) : (
						<div className="HH-input-container" />
					)}
					<div className="HH-buttons-container">
						<i className="HH-bell-icon" />
						<i className="HH-settings-icon" onClick={toggleModal} />
						<i className="HH-photo-icon" onClick={toggleModal} />
					</div>
				</div>
			</div>
			{modalIsOpen && <ConfigurationModal />}
		</div>
	);
}

export default HeaderHome;
