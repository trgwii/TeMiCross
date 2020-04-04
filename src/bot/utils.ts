import fs from 'fs';

import {
	__,
	compose,
	concat,
	flip,
	join,
	prop,
	props,
	replace,
	tap,
} from 'ramda';

export const load = compose(JSON.parse, flip(fs.readFileSync)('utf8'));

export const escape = compose(
	replace(/>/g, '&gt;'),
	replace(/</g, '&lt;'),
	replace(/&/g, '&amp;'),
	String,
);

export const code = compose(concat(__, '</code>'), concat('<code>'), escape);

export const name = prop('first_name');

export const log = tap(console.log);

export const logError = tap(
	compose(console.error, join(': '), props(['name', 'message'])),
);
