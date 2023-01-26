import path from 'path';
import webpack from 'webpack';
import { config } from './config/webpack/config';
import { Env, Paths } from './config/webpack/types/types';

export default (env: Env): webpack.Configuration => {
	const { mode, port, analyzeBuild } = env || {};
	const isDev = mode === 'development';
	const paths: Paths = {
		src: path.resolve(__dirname, 'src'),
		entry: path.resolve(__dirname, 'src', 'index.ts'),
		output: path.resolve(__dirname, 'build'),
		html: path.resolve(__dirname, 'public', 'index.html'),
		public: '/',
	};

	return config({
		mode,
		paths,
		isDev,
		port,
		analyzeBuild,
	});
};
