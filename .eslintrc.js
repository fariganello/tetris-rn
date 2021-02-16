module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    "quotes": ["error", "single"],
    "comma-dangle": ["error", "always-multiline"],
    "indent": [2, 2, { SwitchCase: 1}],
    "react-native/no-inline-styles": 0,
    "prettier/prettier": ["error", {
      "endOfLine":"auto",
      "tabs": "true",
    }],
  },
};
