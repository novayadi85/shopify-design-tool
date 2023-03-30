module.exports = exports = {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "react-app",
      "react-app/jest"
    ],
    "parserOptions": {
      "parser": "babel-eslint"
  },
    "rules": {
      "wrap-regex": "off",
      "no-unused-vars": "off",
      "no-exhaustive-deps": "off",
      "no-mixed-spaces-and-tabs": "off",
      "no-case-declarations": "off",
      "no-useless-escape": "off",
      "no-empty": "off",
      "no-extra-semi": "off",
      "no-empty-pattern": "off",
      "eqeqeq": "off",
        "no-template-curly-in-string": "off",
      "react-hooks/exhaustive-deps": "off",
      "array-callback-return": "off",
      "import/no-anonymous-default-export": "off"
  }
};