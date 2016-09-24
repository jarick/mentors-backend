module.exports = {
  entry: "./sites/site/lib/index.js",
  output: {
      path: __dirname,
      filename: "index.js"
  },
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ["es2015-node6", "stage-0"]
				}
			}
		]
	}
}