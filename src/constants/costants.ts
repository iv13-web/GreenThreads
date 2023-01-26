import { PrioritiesNames } from 'types';

export const DEFAULT_OVERALL_ITERATION_TIME = 14;

export const DEFAULT_IDLE_TIME = DEFAULT_OVERALL_ITERATION_TIME * 1.5;

export const ARR_LENGTH = 50e5;

export const PRIORITY_COEFFICIENTS = {
	[PrioritiesNames.low]: 0.5,
	[PrioritiesNames.default]: 1,
	[PrioritiesNames.high]: 2,
	[PrioritiesNames.critical]: 4,
};

export const DEMO_THREADS = [
	PrioritiesNames.critical,
	PrioritiesNames.low,
	PrioritiesNames.critical,
	PrioritiesNames.default,
	PrioritiesNames.high,
	PrioritiesNames.low,
	PrioritiesNames.critical,
	PrioritiesNames.low,
	PrioritiesNames.default,
	PrioritiesNames.high,
];

5 000 000
