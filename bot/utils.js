'use strict';

const fs = require('fs');

const __ = require('ramda/src/__'); // eslint-disable-line no-underscore-dangle
const compose = require('ramda/src/compose');
const concat = require('ramda/src/concat');
const flip = require('ramda/src/flip');
const join = require('ramda/src/join');
const prop = require('ramda/src/prop');
const props = require('ramda/src/props');
const replace = require('ramda/src/replace');
const tap = require('ramda/src/tap');

const load = compose(
	JSON.parse,
	flip(fs.readFileSync)('utf8'));

const escape = compose(
	replace(/>/g, '&gt;'),
	replace(/</g, '&lt;'),
	replace(/&/g, '&amp;'),
	String);

const code = compose(
	concat(__, '</code>'),
	concat('<code>'),
	escape);

const name = prop('first_name');

const log = tap(console.log);

const logError = tap(compose(
	console.error,
	join(': '),
	props([ 'name', 'message' ])));

module.exports = {
	code,
	escape,
	load,
	log,
	logError,
	name
};
