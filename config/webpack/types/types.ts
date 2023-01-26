export type Mode = 'production' | 'development';

enum PathNames {
	SRC = 'src',
	ENTRY = 'entry',
	OUTPUT = 'output',
	HTML = 'html',
	PUBLIC = 'public',
}

export type Paths = Record<PathNames, string>;

export interface Env {
	mode: Mode;
	port: number;
	analyzeBuild?: boolean;
}

export interface Options extends Env {
	paths: Paths;
	isDev: boolean;
}
