const fileSystem = require("fs");
const path = require("path");

const directory = path.join(__dirname, "../../../database_content/icons");
fileSystem.mkdirSync(directory, { recursive: true });

async function readMetadata() {}

async function retrieveUserProfileIcon(userId) {
	const iconPath = path.join(directory, `${userId}.png`);
	if (!fileSystem.existsSync(iconPath)) {
		throw new Error("Icon not found");
	}

	const icon = fileSystem.readFileSync(iconPath);
	return icon.toString("base64");
}

async function uploadUserProfileIcon(file) {
	console.log(file);
}

export { readMetadata, retrieveUserProfileIcon, uploadUserProfileIcon };
