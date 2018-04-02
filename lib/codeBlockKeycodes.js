'use strict';

const flow = require('lodash/flow');
const fromPairs = require('lodash/fp/fromPairs');
const map = require('lodash/fp/map');
const exec = require('execall');
const { stripComments } = require('./comments');

const KEYCODE_DEFINITION_REGEX = /^(.+?)\s+(.*)/gm;

exports.parseKeycodeBlock = flow(
	stripComments,
	_ => exec(KEYCODE_DEFINITION_REGEX, _),
	map('sub'),
	fromPairs,
);
