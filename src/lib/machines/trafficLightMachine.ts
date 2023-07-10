import { createMachine, interpret } from 'xstate';

const trafficLightMachine = createMachine({
	id: 'trafficLight',
	initial: 'green',
	states: {
		green: {
			on: {
				TIMER: 'yellow'
			}
		},
		yellow: {
			on: {
				TIMER: 'red'
			}
		},
		red: {
			on: {
				TIMER: 'green'
			}
		}
	}
});

export const trafficLightService = interpret(trafficLightMachine).start();
