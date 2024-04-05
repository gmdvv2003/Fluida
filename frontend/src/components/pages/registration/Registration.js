import { useRef, useState } from "react";

import Header from "components/shared/login-registration/header/Header";

import AccountInformation from "./procedures/AccountInformation";
import PasswordCreation from "./procedures/PasswordCreation";

function Registration() {
	const [currentProcedure, setCurrentProcedure] = useState(1);

	function nextProcedure() {
		setCurrentProcedure(currentProcedure + 1);
	}

	function previousProcedure() {
		setCurrentProcedure(Math.max(currentProcedure - 1, 0));
	}

	return (
		<div>
			<Header />
			<div>
				{(() => {
					switch (currentProcedure) {
						case 0:
							return (
								<AccountInformation
									nextProcedure={nextProcedure}
									previousProcedure={previousProcedure}
								/>
							);

						case 1:
							return (
								<PasswordCreation
									nextProcedure={nextProcedure}
									previousProcedure={previousProcedure}
								/>
							);

						default:
							break;
					}
				})()}
			</div>
		</div>
	);
}

export default Registration;
