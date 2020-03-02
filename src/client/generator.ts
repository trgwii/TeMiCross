import {
	__,
	append,
	assoc,
	compose,
	concat,
	flip,
	ifElse,
	intersperse,
	is,
	map,
	nthArg,
	of,
	replace,
	split,
	startsWith,
	trim,
	when
} from 'ramda';

export const textJSON = when(
	is(String),
	compose(
		intersperse('\n'),
		map(ifElse(
			compose(startsWith('>'), trim),
			assoc('text', __, { color: 'green' }),
			assoc('text', __, { color: 'white' })
		)),
		split('\n'),
		replace(/\n/g, '\n ')));

// eslint-disable-next-line no-unused-vars
const replyTextJSON = compose(
	of,
	concat(__, '\n'),
	concat('\n > '),
	replace(/\n/g, '\n > '));

const userJSON = ifElse(
	nthArg(1),
	compose(
		flip(append)([
			{ text: 'TG', color: 'blue' },
			{ text: ': ', color: 'white' }
		]),
		assoc('text', __, { color: 'white' })),
	of);

const hoverUserJSON = (hoverText, telegram, name, text) => [
	' (',
	{
		text: hoverText,
		color: 'yellow',
		hoverEvent: {
			action: 'show_text',
			value: [
				{ text: '<', color: 'white' },
				...userJSON(name, telegram),
				{ text: '> ', color: 'white' },
				...textJSON(text)
			]
		}
	},
	')'
];

const fromJSON = (name, telegram, reply) => [
	'<',
	...userJSON(name, telegram),
	...reply || [],
	'> '
];


export const messageJSON = (telegram, from, text,
	hoverType,
	hoverUserTelegram, hoverUser, hoverText) => [
	...fromJSON(from, telegram,
		hoverUser &&
			hoverUserJSON(hoverType, hoverUserTelegram, hoverUser, hoverText)),
	// ...replyText ? replyTextJSON(replyText) : [],
	...textJSON(text)
];
