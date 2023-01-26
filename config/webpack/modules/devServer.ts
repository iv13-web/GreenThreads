import type { Configuration as DevServerConfig } from 'webpack-dev-server';
import { Options } from '../types/types';

export function devServer({ port }: Options): DevServerConfig {
	return {
		port,
		open: true,
		client: {
			overlay: false,
		},
	};
}
