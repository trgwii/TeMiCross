'use strict';

const __ = require('ramda/src/__'); // eslint-disable-line no-underscore-dangle
const compose = require('ramda/src/compose');
const concat = require('ramda/src/concat');
const flip = require('ramda/src/flip');
const replace = require('ramda/src/replace');
const tap = require('ramda/src/tap');

const fs = require('fs');
const readFileSync = flip(fs.readFileSync);

const load = compose(
	JSON.parse,
	readFileSync('utf8'));

const escape = compose(
	replace(/>/g, '&gt;'),
	replace(/</g, '&lt;'),
	replace(/&/g, '&amp;'));

const code = compose(
	concat(__, '</code>'),
	concat('<code>'),
	escape);

const name = user => user.first_name;

const log = tap(console.log);

module.exports = {
	code,
	escape,
	load,
	log,
	name
};
