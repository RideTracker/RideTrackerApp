module.exports = function(api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module-resolver",
				{
					alias: {
						assets: "./assets",
						app: "./app",
						root: "./"
					},
				},
			],

			["@babel/plugin-proposal-private-methods", { "loose": true }]
		]
	};
};
