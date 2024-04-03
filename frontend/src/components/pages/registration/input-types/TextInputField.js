function TextInputField({ name, placeholder, grid_area }) {
	return (
		<div>
			<div>
				<input
					name={name}
					type="text"
					autoComplete={name}
					required
					placeholder={placeholder}
				/>
			</div>
		</div>
	);
}

export default TextInputField;
