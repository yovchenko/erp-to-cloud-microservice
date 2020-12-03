// eslint-disable-next-line no-undef
const webpack = require("webpack");
// eslint-disable-next-line no-undef
const path = require("path");
// eslint-disable-next-line no-undef
const nodeExternals = require("webpack-node-externals");
// eslint-disable-next-line no-undef
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// eslint-disable-next-line no-undef
module.exports = {
  entry: ["./server/source/index.ts"],
  watch: true,
  target: "node",
  externals: [
    nodeExternals({
      whitelist: ["webpack/hot/poll?100"]
    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  mode: "development",
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [new CleanWebpackPlugin(), new webpack.HotModuleReplacementPlugin()],
  output: {
    // eslint-disable-next-line no-undef
    path: path.join(__dirname, "server/dist"),
    filename: "index.js"
  }
};
