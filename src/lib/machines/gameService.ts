import { raise } from 'xstate';
import { createMachine, assign, interpret } from 'xstate';

export const machine = createMachine(
	{
		id: 'Witcher old world automata',
		context: {
			witcher: 'bear',
			actionDeck: [],
			actionDiscard: [],
			difficulty: 'medium',
			challengeDeck: [],
			challengeDiscard: [],
			automaCards: []
		},
		initial: 'Setting up',
		states: {
			'Setting up': {
				initial: 'Pick difficulty',
				states: {
					'Choose witcher': {
						on: {
							'choose witcher': {
								target: 'Done',
								actions: [
									assign({
										witcher: (context, event) => event.witcher
									}),
									'setup deck'
								]
							}
						}
					},
					Done: {
						type: 'final'
					},
					'Pick difficulty': {
						on: {
							'pick difficulty': {
								target: 'Choose witcher',
								actions: assign({
									difficulty: (context, event) => event.difficulty
								})
							}
						}
					}
				},
				onDone: {
					target: 'Playing'
				}
			},
			Playing: {
				on: {
					'Draw card': {
						actions: assign((context, event) => {
							const deck = event.deck === 'action' ? 'actionDeck' : 'challengeDeck';
							const discard = event.deck === 'action' ? 'actionDiscard' : 'challengeDiscard';
							const [card, ...actionDeck] = context[deck];
							return {
								...context,
								[deck]: actionDeck,
								[discard]: [...context[discard], card]
							};
						})
					},
					'Reset deck': {
						actions: assign((context, event) => {
							const deck = event.deck === 'action' ? 'actionDeck' : 'challengeDeck';
							const discard = event.deck === 'action' ? 'actionDiscard' : 'challengeDiscard';
							return {
								...context,
								[deck]: [...context[discard], ...context[deck]].sort(() => Math.random() - 0.5),
								[discard]: []
							};
						})
					},
					'Collect trophy': [
						{
							actions: [
								assign((context, event) => {
									const [card, ...automaCards] = context.automaCards;
									return {
										...context,
										automaCards,
										challengeDeck: [...context.challengeDeck, card]
									};
								}),
								raise({
									deck: 'challenge',
									type: 'Reset deck'
								})
							],
							cond: 'has trophy'
						},
						{
							target: 'end'
						}
					]
				}
			},
			end: {
				on: {
					Reset: {
						target: 'Setting up'
					}
				}
			}
		},
		schema: {
			context: {} as {
				witcher: Witcher;
				actionDeck: any[];
				actionDiscard: any[];
				difficulty: Difficulty;
				challengeDeck: any[];
				challengeDiscard: any[];
				automaCards: any[];
			},
			events: {} as
				| {
						type: 'choose witcher';
						witcher: Witcher;
				  }
				| {
						type: 'pick difficulty';
						difficulty: Difficulty;
				  }
				| {
						type: 'Draw card';
						deck: 'action' | 'challenge';
				  }
				| {
						type: 'Reset deck';
						deck: 'action' | 'challenge';
				  }
				| {
						type: 'Collect trophy';
				  }
				| {
						type: 'Reset';
				  }
		},
		predictableActionArguments: true,
		preserveActionOrder: true,
		tsTypes: {} as import('./gameService.typegen').Typegen0
	},
	{
		actions: {},
		services: {},
		guards: {
			'has trophy': (context) => context.automaCards.length > 0
		},
		delays: {}
	}
);

export const difficulties = [
	{
		id: 'easy',
		name: 'Easy'
	},
	{
		id: 'medium',
		name: 'Medium'
	},
	{
		id: 'hard',
		name: 'Hard'
	}
] as const;
type Difficulty = (typeof difficulties)[number]['id'];

export const witchers = [
	{
		id: 'bear',
		name: 'Bear',
		image: 'https://i.imgur.com/5z1qZ5f.png'
	},
	{
		id: 'cat',
		name: 'Cat',
		image: 'https://i.imgur.com/5z1qZ5f.png'
	},
	{
		id: 'griffin',
		name: 'Griffin',
		image: 'https://i.imgur.com/5z1qZ5f.png'
	},
	{
		id: 'manticore',
		name: 'Manticore',
		image: 'https://i.imgur.com/5z1qZ5f.png'
	},
	{
		id: 'viper',
		name: 'Viper',
		image: 'https://i.imgur.com/5z1qZ5f.png'
	},
	{
		id: 'wolf',
		name: 'Wolf',
		image: 'https://i.imgur.com/5z1qZ5f.png'
	},
	{
		id: 'ciri',
		name: 'Ciri',
		image: 'https://i.imgur.com/5z1qZ5f.png'
	}
] as const;
type Witcher = (typeof witchers)[number]['id'];

export const cards = [...Array(27).keys()]
	.map((i) => {
		const type = i % 9 > 5 ? 'specific' : 'generic';
		const level = Math.floor(i / 9) + 1;
		return {
			id: i,
			name: `Card ${i}`,
			type,
			level,
			image: `/assets/cards/${i}.png`
		};
	})
	.sort(() => Math.random() - 0.5);

export type DeckType = 'action' | 'challenge';
type Card = {
	id: number;
	name: string;
	type: 'generic' | 'specific';
	level: number;
};

const setupDeckCardCounts = {
	medium: {
		actionDeck: {
			generic: [3, 3, 3],
			specific: [1, 1, 1]
		},
		challenge: {
			generic: [3, 3, 0],
			specific: [2, 2, 2]
		}
	},
	easy: {
		actionDeck: {
			generic: [4, 4, 2],
			specific: [1, 1, 1]
		},
		challenge: {
			generic: [2, 2, 1],
			specific: [2, 2, 2]
		}
	},
	hard: {
		actionDeck: {
			generic: [2, 2, 2],
			specific: [1, 1, 1]
		},
		challenge: {
			generic: [3, 3, 0],
			specific: [2, 2, 2]
		}
	}
};

export const gameService = interpret(
	machine.withConfig({
		actions: {
			'setup deck': assign((context) => {
				const { difficulty } = context;
				const actionDeck: Card[] = [];
				const challengeDeck: Card[] = [];
				const automaCards: Card[] = [];
				for (const level of [1, 2, 3]) {
					const levelIndex = level - 1;
					const genericCards = cards.filter(
						(card) => card.type === 'generic' && card.level === level
					) as Card[];
					const specificCards = cards.filter(
						(card) => card.type === 'specific' && card.level === level
					) as Card[];

					for (const index of Array(
						setupDeckCardCounts[difficulty].actionDeck.generic[levelIndex]
					)) {
						actionDeck.push(genericCards.pop() as Card);
					}

					for (const index of Array(
						setupDeckCardCounts[difficulty].actionDeck.specific[levelIndex]
					)) {
						actionDeck.push(specificCards.pop() as Card);
					}

					for (const index of Array(
						setupDeckCardCounts[difficulty].challenge.generic[levelIndex]
					)) {
						challengeDeck.push(genericCards.pop() as Card);
					}

					for (const index of Array(
						setupDeckCardCounts[difficulty].challenge.specific[levelIndex]
					)) {
						challengeDeck.push(specificCards.pop() as Card);
					}

					if (level === 3) {
						automaCards.push(...genericCards.slice(0, 3));
					}
				}
				return {
					...context,
					actionDeck: actionDeck.sort(() => Math.random() - 0.5),
					challengeDeck: challengeDeck.sort(() => Math.random() - 0.5),
					automaCards
				};
			})
		}
	})
).start();
