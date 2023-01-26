import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Options } from '../types/types';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export function plugins({ paths, isDev }: Options): webpack.WebpackPluginInstance[] {
	const plugins = [
		new HtmlWebpackPlugin({
			template: paths.html,
		}),
		new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
	] as webpack.WebpackPluginInstance[];

	return plugins;
}
