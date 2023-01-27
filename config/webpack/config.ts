import webpack from 'webpack';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { devServer } from './modules/devServer';
import { loaders } from './modules/loaders';
import { plugins } from './modules/plugins';
import { resolvers } from './modules/resolvers';
import { Options } from './types/types';

export function config(options: Options): webpack.Configuration {
	const { paths, mode, isDev } = options;
	return {
		mode,
		entry: paths.entry,
		output: {
			filename: isDev ? '[name].js' : '[name].[contenthash].js',
			path: paths.output,
			publicPath: paths.public,
			clean: true,
		},
		plugins: plugins(options),
		module: {
			rules: loaders(options),
		},
		optimization: {
			minimizer: [new CssMinimizerPlugin()],
		},
		resolve: resolvers(options),
		devtool: isDev && 'inline-source-map',
		devServer: isDev ? devServer(options) : undefined,
	};
}
