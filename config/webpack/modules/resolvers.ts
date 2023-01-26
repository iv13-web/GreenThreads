import webpack from 'webpack';
import { Options } from '../types/types';

export function resolvers({ paths }: Options): webpack.ResolveOptions {
	return {
		extensions: ['.tsx', '.ts', '.js'],
		preferAbsolute: true,
		modules: [paths.src, 'node_modules'],
		alias: {},
	};
}
