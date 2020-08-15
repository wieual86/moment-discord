module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:jest/recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {}
};
