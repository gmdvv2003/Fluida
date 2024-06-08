import "./SystemPopupsContext.css";

import { createContext, useContext, useState } from "react";

import { CommonPopup } from "./popup-modals/common/CommonPopup";

// Estilos padrões para o componente de popups

const POPUPS_MODAL_TYPES = {
	Common: CommonPopup,
};

const SystemPopupsContext = createContext();

export function useSystemPopups() {
	return useContext(SystemPopupsContext);
}

export function SystemPopupsProvider({ children }) {
	const [popups, setPopups] = useState([]);

	/**
	 * Gera um novo popup
	 *
	 * @param {string} popupIdentifier
	 * @param {any} popupModalData
	 */
	function newPopup(modalType, modalData, dismissAfter = 5) {
		if (!POPUPS_MODAL_TYPES[modalType]) {
			throw new Error("Tipo de popup não encontrado");
		}

		// Gera um UUID para o popup
		const uuid = window.crypto.randomUUID();

		const PopupConstructor = POPUPS_MODAL_TYPES[modalType];
		setPopups((popups) => [...popups, { PopupConstructor, popupData: { uuid, ...modalData } }]);

		if (dismissAfter != null) {
			setTimeout(() => {
				dismissPopup(uuid);
			}, dismissAfter * 1000);
		}

		return uuid;
	}

	/**
	 * Remove um popup da lista
	 *
	 * @param {string} popupGUID
	 */
	function dismissPopup(popupGUID) {
		// Atualiza o valor isGettingDeleted to popup
		setPopups((popups) =>
			popups.map((popup) => {
				if (popup.popupData.uuid === popupGUID) {
					return { ...popup, isGettingDeleted: true };
				}

				return popup;
			})
		);

		setTimeout(() => {
			// Remove o popup da lista
			setPopups((popups) => popups.filter((popup) => popup.popupData.uuid !== popupGUID));
		}, 2000);
	}

	const systemPopupsProviderFunctions = { newPopup, dismissPopup };

	return (
		<SystemPopupsContext.Provider value={systemPopupsProviderFunctions}>
			<div className="SPC-popups-container">
				{popups.map(({ PopupConstructor, popupData, isGettingDeleted }) => (
					<div
						key={popupData.uuid}
						className={`SPC-popup-holder-background ${
							isGettingDeleted ? "SPC-popup-background-out" : ""
						}`}
					>
						<div
							className={`SPC-popup-holder ${
								isGettingDeleted ? "SPC-popup-out" : "SPC-popup-start"
							}`}
						>
							{PopupConstructor(systemPopupsProviderFunctions, popupData)}
						</div>
					</div>
				))}
			</div>

			{children}
		</SystemPopupsContext.Provider>
	);
}
