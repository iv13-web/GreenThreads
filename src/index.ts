import './styles.css';
import 'ui';
import { DOM_SELECTORS } from 'ui';
import { ThreadMaker } from 'core';
import { ARR_LENGTH, DEMO_THREADS } from './constants';
import { logDone } from 'utils';

const thread = new ThreadMaker();

const arr = [...Array(ARR_LENGTH).keys()];

DEMO_THREADS.forEach((priority, i) => {
	thread
		.onEach(
			arr,
			(_, index) => {
				const count = index + 1;
				const width = (count / ARR_LENGTH) * 100;
				const { progresses } = DOM_SELECTORS;
				progresses[i].style.width = `${width}%`;

				if (index % 100000 === 0 || count === ARR_LENGTH) {
					console.log(`${index} elements of ${priority.toUpperCase()} queue iterated`);
				}
			},
			{ priority },
		)
		.then(logDone(priority, i));
});
