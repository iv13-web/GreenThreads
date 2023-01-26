import { PRIORITY_COEFFICIENTS } from '../constants';

export type Priority = keyof typeof PRIORITY_COEFFICIENTS;

export type Callback<T> = (el: T, index: number, iterable: Iterable<T>) => void;

export type Task = {
	worker: Generator<'pause' | Error>;
	priority: Priority;
	resolve: (data?: unknown) => void;
	reject: (error?: unknown) => void;
};

export type Options = {
	overallExecTimeForOneIteration?: number;
	idleTime?: number;
};

export enum PrioritiesNames {
	low = 'low',
	default = 'default',
	high = 'high',
	critical = 'critical',
}
