const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Load *package.json" so we can use `dependencies` from there
const pkg = require('./package.json');


const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build'),
	style: path.join(__dirname, 'app/main.css')
};

process.env.BABEL_ENV = TARGET;

const common = {
	// Entry accepts a path or an object of entries. We'll be using the
	// latter form given its more convenient with more complex configs.
	entry: {
		app: PATHS.app,
		style: PATHS.style
	},
	// add resolve.extensions
	// '' is needed to allow imports without an extensions
	// note that the .'s in the extensions are necessary
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: PATHS.build,
		filename: '[name].js'
	},
	module: {
		loaders: [
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
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'node_modules/html-webpack-template/index.ejs',
			title: 'Kanban app',
			appMountId: 'app',
			inject: false
		})
	]
}

// Default configuration
if (TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {

		devtool: 'eval-source-map',
		devServer: {
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
		module: {
			loaders: [
				// define development specific CSS setup
				{
					// Test expects a RegExp! Note the slashes!
					test: /\.css$/,
					loaders: ['style', 'css'],
					// Include accepts either a path or an array of paths.
					include: PATHS.app
				}
			]
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new NpmInstallPlugin({
				save: true // --save
			})
		]
	});
}

if (TARGET === 'build' || TARGET === 'stats') {
	module.exports = merge(common, {
		// define vendor entry point needed for splitting
		entry: {
			vendor: Object.keys(pkg.dependencies).filter(function(v) {
				// Exclude alt-utils as it won't work with this setup
				// due to the way the package has been designed
				// (no package.json main).
				return v !== 'alt-utils';
			})
		},
		output: {
			path: PATHS.build,
			filename: '[name].[chunkhash].js',
			chunkFilename: '[chunkhash].js'
		},
		module: {
			loaders: [
				// extract CSS during build
				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract('style', 'css'),
					include: PATHS.app
				}
			]
		},
		plugins: [
			new CleanPlugin([PATHS.build], {
				verbose: false // don't write logs to console
			}),
			new ExtractTextPlugin('[name].[chunkhash].css'),
			// extract vendor and manifest files
			new webpack.optimize.CommonsChunkPlugin({
				names: ['vendor', 'manifest']
			}),
			// setting DefinePlugin affects React library size!
			// DefinePlugin replaces content "as is" so we need
			// some extra quotes for the generated code to make
			// sense
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': '"production"'
				// you can set this to JSON.stringify('development')
				// for your dev target to force NODE_ENV to
				// dev mode no matter what
			}),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			})
		]
	});
}