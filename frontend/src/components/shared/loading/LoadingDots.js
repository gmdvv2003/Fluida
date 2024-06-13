import "./LoadingDots.css";

function LoadingDots({ scale = 1, style }) {
	return (
		<div
			style={{
				...style,
				transform: `scale(${scale})`,
			}}
		>
			<div className="loader"></div>
		</div>
	);
}

export default LoadingDots;
