// eslint.config.js
export default [
	{
		rules: {
			semi: "error",
			"prefer-const": "error",
		},

		"sort-imports": [
			"error",
			{
				ignoreCase: false,
				ignoreDeclarationSort: false,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
				allowSeparatedGroups: false,
			},
		],
	},
];
