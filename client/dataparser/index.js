"use strict";

const bracketSplit = require("bracket-split");

const unwrap = (str) => str.slice(1, -1);

const surroundedBy = (a, b, str) => str.startsWith(a) && str.endsWith(b);

const trim = (x) => x.trim();

/* eslint-disable no-nested-ternary, indent, operator-linebreak, max-len */

const parse = (str) =>
  surroundedBy("[", "]", str)
    ? bracketSplit(",", unwrap(str)).map(trim).map(parse)
    : surroundedBy("{", "}", str)
    ? bracketSplit(",", unwrap(str))
        .map(trim)
        .map((kv) => {
          const [key, value] = bracketSplit(":", kv);
          return [key, parse(value.trim())];
        })
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    : surroundedBy('"', '"', str)
    ? unwrap(str)
    : str.match(/^-?\d+L$/)
    ? str.slice(0, -1)
    : str.match(/^-?\d+(\.\d+)?(d|s|f|b)$/)
    ? Number(str.slice(0, -1))
    : str.match(/^-?\d+$/)
    ? Number(str)
    : str;

module.exports = parse;
