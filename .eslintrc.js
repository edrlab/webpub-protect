// https://eslint.org/docs/user-guide/configuring
module.exports = {
    "overrides": [
        {
            "files": ["src/server/**/*.js"],
            "extends": [
                "plugin:node/recommended-script"
            ],
            "parserOptions": {
                "ecmaVersion": 2019,
                "sourceType": "script"
            },
            "rules": {
            }
        }
    ],
    "env": {
        "browser": true,
        "es6": true,
        "es2020": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:prettier/recommended"
        // "prettier"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module"
    },
    "rules": {
        "quotes": ["error", "single"],
        "comma-dangle": ["error", "always-multiline"],
        "eol-last": ["error", "always"],
        "semi": ["error", "always"],
        "no-unused-vars": ["error", {
            "vars": "all",
            "args": "all",
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "caughtErrorsIgnorePattern": "^_",
            "caughtErrors": "all" }
        ],
        "prettier/prettier": "error",
    },
    "plugins": ["prettier"],
};
