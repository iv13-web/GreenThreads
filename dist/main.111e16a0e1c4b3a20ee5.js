/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/types/types.ts
var PrioritiesNames;
(function (PrioritiesNames) {
    PrioritiesNames["low"] = "low";
    PrioritiesNames["default"] = "default";
    PrioritiesNames["high"] = "high";
    PrioritiesNames["critical"] = "critical";
})(PrioritiesNames || (PrioritiesNames = {}));

;// CONCATENATED MODULE: ./src/types/index.ts


;// CONCATENATED MODULE: ./src/constants/constants.ts

const DEFAULT_OVERALL_ITERATION_TIME = 14;
const DEFAULT_IDLE_TIME = DEFAULT_OVERALL_ITERATION_TIME * 1.5;
const ARR_LENGTH = 5e6;
const PRIORITY_COEFFICIENTS = {
    [PrioritiesNames.low]: 0.5,
    [PrioritiesNames["default"]]: 1,
    [PrioritiesNames.high]: 2,
    [PrioritiesNames.critical]: 4,
};
const DEMO_THREADS = [
    PrioritiesNames.critical,
    PrioritiesNames.low,
    PrioritiesNames.critical,
    PrioritiesNames["default"],
    PrioritiesNames.high,
    PrioritiesNames.low,
    PrioritiesNames.critical,
    PrioritiesNames.low,
    PrioritiesNames["default"],
    PrioritiesNames.high,
];

;// CONCATENATED MODULE: ./src/constants/index.ts


;// CONCATENATED MODULE: ./src/ui/index.ts

const indicatorsWrapper = document.querySelector('.indicator-wrapper');
const createIndicatorTemplate = (threadPriority) => {
    const indicatorTemplate = `
		<span class="priority">${threadPriority} priority</span>
		<div class="indicator">
			<div class="progress ${threadPriority}"></div>
		</div>
	`;
    indicatorsWrapper.insertAdjacentHTML('beforeend', indicatorTemplate);
};
DEMO_THREADS.forEach((thread) => {
    createIndicatorTemplate(thread);
});
const DOM_SELECTORS = {
    button: document.querySelector('button'),
    underlay: document.querySelector('.plate-underlay'),
    indicatorsWrapper: document.querySelector('.indicator-wrapper'),
    indicators: [...document.querySelectorAll('.indicator')],
    progresses: [...document.querySelectorAll('.progress')],
};
const LOGS_STYLE = {
    critical: 'background-color:#ffc7d2;color:#000;font-size:16px;font-weight:bold',
    high: 'background-color:#ffcda6;color:#000;font-size:16px;font-weight:bold',
    default: 'background-color:#ffbbf5;color:#000;font-size:16px;font-weight:bold',
    low: 'background-color:#c5db93;color:#000;font-size:16px;font-weight:bold',
};
DOM_SELECTORS.button.addEventListener('click', () => {
    const { underlay } = DOM_SELECTORS;
    if (underlay.classList.contains('clicked')) {
        underlay.classList.remove('clicked');
        setTimeout(() => {
            underlay.classList.add('clicked');
        });
    }
    else {
        underlay.classList.add('clicked');
    }
});

;// CONCATENATED MODULE: ./src/core/ThreadMaker.ts


class ThreadMaker {
    overallExecTimeForOneIteration;
    staleTime;
    execTimePerOneCoefficientPoint;
    tasks = new Set();
    tasksQueue = [];
    hasExecutionStarted = false;
    constructor({ overallExecTimeForOneIteration, staleTime } = {}) {
        this.overallExecTimeForOneIteration =
            overallExecTimeForOneIteration || DEFAULT_OVERALL_ITERATION_TIME;
        this.staleTime = staleTime || DEFAULT_IDLE_TIME;
    }
    *createWorker(iterable, cb, priority) {
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
            }
            catch (e) {
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
            while (this.tasksQueue[index] != null &&
                PRIORITY_COEFFICIENTS[this.tasksQueue[index].priority] <
                    PRIORITY_COEFFICIENTS[task.priority]) {
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
            }
            else {
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
    onEach(iterable, callback, options = { priority: PrioritiesNames["default"] }) {
        const { priority } = options;
        const worker = this.createWorker(iterable, callback, priority);
        return new Promise((resolve, reject) => {
            this.tasks.add({ worker, priority, resolve, reject });
            this.execute();
        });
    }
}

;// CONCATENATED MODULE: ./src/core/index.ts


;// CONCATENATED MODULE: ./src/utils/logDone.ts

const logDone = (priority, i) => () => {
    console.log(`%cFINISH ${priority.toUpperCase()} priority queue`, `${LOGS_STYLE[priority]}`);
};

;// CONCATENATED MODULE: ./src/utils/index.ts


;// CONCATENATED MODULE: ./src/index.ts






const thread = new ThreadMaker();
const arr = [...Array(ARR_LENGTH).keys()];
DEMO_THREADS.forEach((priority, i) => {
    thread
        .onEach(arr, (_, index) => {
        const count = index + 1;
        const width = (count / ARR_LENGTH) * 100;
        const { progresses } = DOM_SELECTORS;
        progresses[i].style.width = `${width}%`;
        if (index % 100000 === 0 || count === ARR_LENGTH) {
            console.log(`${index} elements of ${priority.toUpperCase()} queue iterated`);
        }
    }, { priority })
        .then(logDone(priority, i));
});

/******/ })()
;