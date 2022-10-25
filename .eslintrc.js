module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	
	"overrides": [],
	
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},

	"plugins": [
		"react"
	],
	
    "rules": {
        "no-extra-semi": "off",
        "no-unused-vars": "off",

        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": "off",
        "semi": [
            "error",
            "always"
        ]
    }
};
