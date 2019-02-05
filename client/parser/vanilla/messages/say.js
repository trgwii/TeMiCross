'use strict';

const username = require('../username');
const text = require('../text');

module.exports = '\\[(?<user>' + username + ')\\] ' + text;
