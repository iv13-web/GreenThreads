import { LOGS_STYLE } from 'ui';
import { Priority } from 'types';

export const logDone = (priority: Priority, i: number) => () => {
	console.log(`%cFINISH ${priority.toUpperCase()} priority queue`, `${LOGS_STYLE[priority]}`);
};
