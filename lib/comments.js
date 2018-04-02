'use strict';

const negate = require('lodash/negate');

const COMMENT_SEQUENCE = '#';

const isComment = line => line.trim().startsWith(COMMENT_SEQUENCE);

exports.stripComments = str => str
	.split('\n')
	.filter(negate(isComment))
	.join('\n');

exports.getComments = str => str
	.split('\n')
	.filter(isComment)
	.map(line => line.replace(COMMENT_SEQUENCE, '').trim());
