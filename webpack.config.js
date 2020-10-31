const webpack = require('webpack');

module.exports = {
  devtool: "cheap-module-source-map",
  target: "webworker",
  mode: "development",
  context: __dirname,
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: [
          { loader: "ts-loader" }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.GH_ACCESS_TOKEN": JSON.stringify(process.env.GH_ACCESS_TOKEN)
    })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
