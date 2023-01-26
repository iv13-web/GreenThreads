import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Options } from '../types/types';

export function plugins({ paths }: Options): webpack.WebpackPluginInstance[] {
	return [
		new HtmlWebpackPlugin({
			template: paths.html,
		}),
	] as webpack.WebpackPluginInstance[];
}
