'use strict';

// eslint-disable-next-line no-underscore-dangle
const __ = require('ramda/src/__');
const append = require('ramda/src/append');
const assoc = require('ramda/src/assoc');
const compose = require('ramda/src/compose');
const concat = require('ramda/src/concat');
const flip = require('ramda/src/flip');
const ifElse = require('ramda/src/ifElse');
const intersperse = require('ramda/src/intersperse');
const is = require('ramda/src/is');
const map = require('ramda/src/map');
const nthArg = require('ramda/src/nthArg');
const of = require('ramda/src/of');
const replace = require('ramda/src/replace');
const split = require('ramda/src/split');
const startsWith = require('ramda/src/startsWith');
const trim = require('ramda/src/trim');
const when = require('ramda/src/when');

const textJSON = when(
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


const messageJSON = (telegram, from, text,
	hoverType,
	hoverUserTelegram, hoverUser, hoverText) => [
	...fromJSON(from, telegram,
		hoverUser &&
			hoverUserJSON(hoverType, hoverUserTelegram, hoverUser, hoverText)),
	// ...replyText ? replyTextJSON(replyText) : [],
	...textJSON(text)
];

module.exports = {
	textJSON,
	messageJSON
};
