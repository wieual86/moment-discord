// This config is necessary to make Jest work

module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [["module-resolver", { root: ["./src"] }]]
};
