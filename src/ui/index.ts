import { DEMO_THREADS } from '../constants';
import { Priority } from 'types';

const indicatorsWrapper = document.querySelector('.indicator-wrapper');

const createIndicatorTemplate = (threadPriority: Priority) => {
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

export const DOM_SELECTORS = {
	button: document.querySelector('button'),
	underlay: document.querySelector('.plate-underlay'),
	indicatorsWrapper: document.querySelector('.indicator-wrapper'),
	indicators: [...document.querySelectorAll('.indicator')] as HTMLElement[],
	progresses: [...document.querySelectorAll('.progress')] as HTMLElement[],
};

export const LOGS_STYLE = {
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
	} else {
		underlay.classList.add('clicked');
	}
});
