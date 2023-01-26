import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Options } from '../types/types';

export function loaders({ isDev }: Options): webpack.RuleSetRule[] {
	const typescriptLoader = {
		test: /\.tsx?$/,
		use: 'ts-loader',
		exclude: /node_modules/,
	};

	const cssLoader = {
		test: /\.css$/i,
		use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
	};

	return [typescriptLoader, cssLoader];
}
