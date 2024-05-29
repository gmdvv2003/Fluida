import "./ActionFeedback.css";
import "../login-registration/container/Container.css";

function Title({ text }) {
	return <h1 className="AF-form-title">{text}</h1>;
}

function SubTitle({ text }) {
	return <h2 className="AF-form-sub-title">{text}</h2>;
}

function Description({ text }) {
	return <p className="AF-form-description">{text}</p>;
}

function Button({ text, onClick = () => {} }) {
	return (
		<div className="AF-button-container">
			<button className="AF-button" onClick={onClick}>
				{text}
			</button>
		</div>
	);
}

function ActionFeedback({ elements }) {
	return (
		<div
			className="LR-C-forms-container-holder"
			style={{
				justifyContent: "start",
				paddingTop: "50px",
				height: "calc(100vh - var(--header-height) - 50px)",
			}}
		>
			<div className="LR-C-forms-container" style={{ height: "180px" }}>
				<div className="LR-C-forms" style={{ width: "80%", padding: "0px" }}>
					<div className="AF-form">
						{elements.map((element) => {
							if (element.type === "custom") {
								return element.component();
							}

							switch (element.type) {
								case "title":
									return Title(element);
								case "subTitle":
									return SubTitle(element);
								case "description":
									return Description(element);
								case "button":
									return Button(element);
								default:
									return null;
							}
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ActionFeedback;
