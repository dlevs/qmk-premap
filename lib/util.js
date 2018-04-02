'use strict';

const exec = require('execall');
const fromPairs = require('lodash/fp/fromPairs');
const map = require('lodash/fp/map');
const filter = require('lodash/fp/filter');
const flow = require('lodash/flow');
const { getComments } = require('./comments');

exports.getMarkdownCodeBlocks = (document, language = '') => {
	// eslint-disable-next-line prefer-template
	const regex = new RegExp('```' + language + '([^]*?)```', 'g');

	return exec(regex, document).map(({ sub }) => sub[0]);
};

exports.getCodeBlockMeta = flow(
	getComments,
	map((comment) => {
		const match = comment.trim().match(/^(\w+)\s*:\s*(.*)/);

		if (!match) return null;

		const [, key, value] = match;
		return [key, value];
	}),
	filter(value => value !== null),
	fromPairs,
);
