// flags.js

import React from "react";

function importAll(context) {
	let flags = {};

	context.keys().forEach((key) => {
		const flagName = key.replace("./", "").replace(".svg", "");
		flags[flagName] = (properties) => {
			return React.createElement("img", {
				src: context(key),
				...properties,
			});
		};
	});

	return flags;
}

export default importAll(require.context("assets/flags-icons/", true, /\.svg$/));
