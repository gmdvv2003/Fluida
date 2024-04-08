import "./Loading.css";

function Loading({ text }) {
	return (
		<div className="S-L-container">
			<div className="S-L-logo-container">
				<img src="fluida-loading.gif" alt="logo" className="S-L-logo" />
			</div>

			<p className="S-L-text">{text}</p>
		</div>
	);
}

export default Loading;
