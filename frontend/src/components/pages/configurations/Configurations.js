import "./Configurations.css";
import HeaderHome from "components/shared/login-registration/header-home/HeaderHome";
import HeaderConfigurations from "./header-configurations/HeaderConfigurations";

function Configurations() {
	return (
		<div>
			<HeaderHome hideSearchBar={true} />
			<div>
				<HeaderConfigurations />
			</div>
		</div>
	);
}

export default Configurations;
