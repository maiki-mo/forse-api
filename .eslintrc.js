module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "jest": true
  },
  "extends": "airbnb",
  "parser": "babel-eslint",
  "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": false
      },
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "rules": {}
};
