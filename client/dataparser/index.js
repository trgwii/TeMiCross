'use strict';

const unwrap = str => str.slice(1, -1);

/* eslint-disable no-nested-ternary, indent, operator-linebreak, max-len */

const parse = str =>
	str.startsWith('[') && str.endsWith(']') ? unwrap(str).split(/\s*,\s*/).map(parse) :
	str.match(/^-?\d+(\.\d+)?d$/) ? Number(str.slice(0, -1)) :
	str.match(/\d+/) ? Number(str) :
	str;

module.exports = parse;
