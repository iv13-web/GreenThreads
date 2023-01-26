import { Callback, Options, PrioritiesNames, Priority, Task } from '../types';
import {
	DEFAULT_IDLE_TIME,
	DEFAULT_OVERALL_ITERATION_TIME,
	PRIORITY_COEFFICIENTS,
} from '../constants';

export class ThreadMaker {
	overallExecTimeForOneIteration: number;
	staleTime: number;
	execTimePerOneCoefficientPoint: number;
	tasks: Set<Task> = new Set();
	tasksQueue: Task[] = [];
	hasExecutionStarted = false;

	constructor({ overallExecTimeForOneIteration, staleTime }: Options = {}) {
		this.overallExecTimeForOneIteration =
			overallExecTimeForOneIteration || DEFAULT_OVERALL_ITERATION_TIME;
		this.staleTime = staleTime || DEFAULT_IDLE_TIME;
	}

	*createWorker<T>(
		iterable: Iterable<T>,
		cb: Callback<T>,
		priority: Priority,
	): Generator<'pause' | Error> {
		const iterator = iterable[Symbol.iterator]();
		let startTime = performance.now();
		let index = 0;

		while (true) {
			const { done, value } = iterator.next();
			if (done) {
				return;
			}

			const timePassed = performance.now() - startTime;
			const timeAvailable = this.execTimePerOneCoefficientPoint * PRIORITY_COEFFICIENTS[priority];

			if (timePassed > timeAvailable) {
				yield 'pause';
				startTime = performance.now();
			}

			try {
				cb(value, index, iterable);
			} catch (e) {
				if (e instanceof Error) {
					yield e;
				}
			}

			index += 1;
		}
	}

	setExecTimePerOneCoefficientPoint() {
		let overallExecTimeCoefficientPoints = 0;
		for (const task of this.tasks.values()) {
			overallExecTimeCoefficientPoints += PRIORITY_COEFFICIENTS[task.priority];
		}
		this.execTimePerOneCoefficientPoint =
			this.overallExecTimeForOneIteration / overallExecTimeCoefficientPoints;
	}

	setTaskQueue() {
		for (const task of this.tasks.values()) {
			let index = this.tasksQueue.length - 1;

			while (
				this.tasksQueue[index] != null &&
				PRIORITY_COEFFICIENTS[this.tasksQueue[index].priority] <
					PRIORITY_COEFFICIENTS[task.priority]
			) {
				this.tasksQueue[index + 1] = this.tasksQueue[index];
				index -= 1;
			}

			this.tasksQueue[index + 1] = task;
		}
	}

	iterate() {
		this.setExecTimePerOneCoefficientPoint();
		this.setTaskQueue();

		let task = this.tasksQueue.shift();
		while (task) {
			const { done, value } = task.worker.next();

			if (done) {
				this.tasks.delete(task);
				task.resolve();
			}

			if (value instanceof Error) {
				task.reject(value);
			}

			task = this.tasksQueue.shift();
		}

		setTimeout(() => {
			if (this.tasks.size > 0) {
				this.iterate();
			} else {
				this.hasExecutionStarted = false;
			}
		}, this.staleTime);
	}

	execute() {
		if (!this.hasExecutionStarted) {
			this.hasExecutionStarted = true;
			setTimeout(this.iterate.bind(this));
		}
	}

	onEach<T>(
		iterable: Iterable<T>,
		callback: Callback<T>,
		options: { priority: Priority } = { priority: PrioritiesNames.default },
	): Promise<void> {
		const { priority } = options;
		const worker = this.createWorker(iterable, callback, priority);

		return new Promise((resolve, reject) => {
			this.tasks.add({ worker, priority, resolve, reject });
			this.execute();
		});
	}
}
