import "./Loading.css";

function Loading({ text }) {
	return (
		<div className="S-L-container">
			<div className="S-L-logo-container">
				<img src="fluida-loading.gif" alt="logo" className="S-L-logo" />
			</div>

			{text ? <p className="S-L-text">{text}</p> : null}
		</div>
	);
}

export default Loading;
