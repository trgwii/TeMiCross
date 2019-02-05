'use strict';

const { writeFileSync } = require('fs');

const save = (name, data) => {
	writeFileSync(`${name}.json`, JSON.stringify(data, null, '\t'));
	return data;
};

module.exports = save;
