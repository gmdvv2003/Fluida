import "./ConfigurationModal.css";

function ConfigurationModal() {
	return (
		<div className="CM-fluida-container">
			<div className="CM-option-account-container">
				<h1 className="CM-title-option">CONTA</h1>
				<a className="CM-text-option" href="/configurations">
					Gerenciar conta
				</a>
				<hr className="CM-hr-divider" />
			</div>
			<div className="CM-option-configuration-container">
				<h1 className="CM-title-option">FLUIDA</h1>
				<a className="CM-text-option" href="/configurations">
					Configurações
				</a>
				<hr className="CM-hr-divider" />
			</div>
			<div className="CM-option-logout-container">
				<a className="CM-text-option" href="">
					Fazer logout
				</a>
			</div>
		</div>
	);
}

export default ConfigurationModal;
