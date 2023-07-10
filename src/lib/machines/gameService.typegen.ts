// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	internalEvents: {
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {};
	missingImplementations: {
		actions: 'setup deck';
		delays: never;
		guards: never;
		services: never;
	};
	eventsCausingActions: {
		'setup deck': 'choose witcher';
	};
	eventsCausingDelays: {};
	eventsCausingGuards: {
		'has trophy': 'Collect trophy';
	};
	eventsCausingServices: {};
	matchesStates:
		| 'Playing'
		| 'Setting up'
		| 'Setting up.Choose witcher'
		| 'Setting up.Done'
		| 'Setting up.Pick difficulty'
		| 'end'
		| { 'Setting up'?: 'Choose witcher' | 'Done' | 'Pick difficulty' };
	tags: never;
}
