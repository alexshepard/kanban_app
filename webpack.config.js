const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {
	// Entry accepts a path or an object of entries. We'll be using the
	// latter form given its more convenient with more complex configs.
	entry: {
		app: PATHS.app
	},
	// add resolve.extensions
	// '' is needed to allow imports without an extensions
	// note that the .'s in the extensions are necessary
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				// Test expects a RegExp! Note the slashes!
				test: /\.css$/,
				loaders: ['style', 'css'],
				// Include accepts either a path or an array of paths.
				include: PATHS.app
			},
			// use babel for jsx and js. 
			// this accepts js too thanks to the regexp
			{
				test: /\.jsx?$/,
				// enable caching for improved performance during dev
				// it uses the default OS directory by default.
				// if you need something more custom, pass a path to
				// it. ie babel?cacheDirectory=<path>
				loaders: ['babel?cacheDirectory'],
				// parse only app files. without this it will go thru
				// the entire project, including node_modules. 
				// in addition to being slow, this also may result in 
				// an error if a module isn't babel compliant
				include: PATHS.app
			}
		]
	}
}

// Default configuration
if (TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {

		devtool: 'eval-source-map',
		devServer: {
			contentBase: PATHS.build,

			// Enable history API fallback so HTML5 history API based
			// routing works. This is a good default that will come
			// in handy in more complicated setups.
			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true,

			// Display only errors to reduce the amount of output.
			stats: 'errors-only',

			// Parse host and port from env so this is easy to customize.
			// if you use vagrant or cloud9, set
			// host: procoess.env.HOST || '0.0.0.0';
			// 0.0.0.0 is available to all network devices, unlike localhost
			host: process.env.HOST,
			port: process.env.PORT
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new NpmInstallPlugin({
				save: true // --save
			})
		]
	});
}

if (TARGET === 'build') {
	module.exports = merge(common, {});
}