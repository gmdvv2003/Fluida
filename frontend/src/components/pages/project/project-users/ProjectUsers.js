import "./ProjectUsers.css";

import { memo, useEffect, useState } from "react";

import TextInputField from "components/shared/text-input-field/TextInputField";
import UserIcon from "components/shared/user-icon/UserIcon";
import OptionsListSelector from "components/shared/options-list-selector/OptionsListSelector";

import { ReactComponent as CircleCheck } from "assets/action-icons/check-circle.svg";
import { ReactComponent as ShareChain } from "assets/action-icons/share-chain.svg";
import { ReactComponent as Lens } from "assets/action-icons/lens.svg";

function ProjectUsers({ projectState }) {
	const [projectUsers, setProjectUsers] = useState(projectState.current?.getMembers());

	const [showInvitationLink, setShowInvitationLink] = useState(false);
	const [invitationLinkSent, setInvitationLinkSent] = useState(false);

	function handleClipboardButtonClick() {
		setTimeout(() => {
			setShowInvitationLink(false);
		}, 2000);

		setShowInvitationLink(true);
	}

	useEffect(() => {
		return projectState.current?.onProjectMembersStateChange((members) => {
			setProjectUsers(members);
		});
	}, []);

	return (
		<div className="PU-project-users-container">
			<div className="PU-project-users-box-container">
				<div className="PU-project-users-form-container">
					<h1 style={{ margin: "0px" }}>Nome do projeto</h1>
					<div className="PU-search-inputfield">
						<TextInputField
							name="search"
							placeholder="Pesquise um membro por nome ou função"
							container_style={{ height: "unset" }}
							style={{
								backgroundColor: "var(--background-elements-color)",
								border: "none",
							}}
							type="text"
						/>
						<Lens className="PU-lens-search" />
					</div>

					<div className="PU-users-in-project-container">
						{projectUsers.map(({ name, icon, role }) => (
							<div title={name} className="PU-users-in-project">
								<UserIcon userIcon64={icon} scale="100px" />
								<h2>@{name}</h2>
								<a>{role}</a>
							</div>
						))}
					</div>

					<h1
						style={{
							fontWeight: "lighter",
							margin: "0px",
							marginTop: "20px",
							fontSize: "27px",
						}}
					>
						Convidar novas pessoas
					</h1>

					<div className="PU-form-container">
						<TextInputField
							name="email"
							placeholder="email@provedor.com.br"
							container_style={{ height: "unset", width: "100%" }}
							style={{
								backgroundColor: "var(--background-elements-color)",
								border: "none",
							}}
							type="text"
							autocomplete="off"
						/>
						<OptionsListSelector
							name="Permissões"
							options={["Membro", "Administrador", "Observador"]}
							style={{
								width: "150px",
								color: "gray",
								fontSize: "16px",
							}}
						/>
						<button className="PU-share-invite-button">Enviar convite</button>
					</div>

					{invitationLinkSent && (
						<div className="PU-invite-sent-container">
							<p className="PU-invite-sent">Convite enviado com sucesso!</p>
						</div>
					)}

					<div style={{ width: "100%" }}>
						<div className="PU-form-container-2">
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<ShareChain className="PU-share-chain" />
								<div className="PU-cliboard-button-container">
									<a style={{ color: "var(--gray-text-general)" }}>
										Qualquer pessoa com o link de compartilhamento pode acessar este quadro.
									</a>

									<button className="PU-clipboard-button" onClick={handleClipboardButtonClick}>
										Copiar link
									</button>
								</div>
							</div>

							<OptionsListSelector
								name="Pode entrar como Membro"
								options={["Pode entrar como Membro", "Pode entrar como Observador"]}
								style={{
									width: "250px",
									color: "gray",
									fontSize: "16px",
								}}
							/>
						</div>

						<div className="PU-form-container-3">
							{showInvitationLink && (
								<div className="PU-clipboard-text-container">
									<CircleCheck className="PU-circle-check" />
									<a>Link copiado para a área de transferência.</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProjectUsers;
