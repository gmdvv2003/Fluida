import "./AccountConfigurations.css";
import HeaderHome from "components/shared/login-registration/header-home/HeaderHome";
import HeaderConfigurations from "./header-configurations/HeaderConfigurations";

function AccountConfigurations() {
	return (
		<div>
			<HeaderHome hideSearchBar={true} />
			<div>
				<HeaderConfigurations />
			</div>

			<div className="AC-forms-container">
				<div className="AC-forms-title-container">
					<h1>Perfil e Visibilidade</h1>
					<a>Edite as informações do seu perfil e suas preferências</a>
				</div>
				<div className="AC-forms-upload-picture-container">
					<div className="AC-forms-">
						<i></i>
						<a>remover</a>
					</div>
					<div>
						<a>Imagem de perfil</a>
						<button>Upload File</button>
						<a>error message</a>
					</div>
					<div>
						<a>nomedaimagem.png</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AccountConfigurations;
