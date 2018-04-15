'use strict';

const exec = require('execall');
const { getCodeBlockMeta } = require('./util');
const { stripComments } = require('./comments');
const expandKeycode = require('./expandKeycode');
const { KEY_DELIMITER, KEY_CHAR_WIDTH } = require('./constants');

const KEY_REGEX = new RegExp(`${KEY_DELIMITER}(.{${KEY_CHAR_WIDTH}})(?=${KEY_DELIMITER})`, 'g');

exports.parseKeymapBlock = (document, keyCodeMap = {}) => {
	const meta = getCodeBlockMeta(document);
	const keys = exec(KEY_REGEX, stripComments(document))
		.map(({ sub }) => sub[0].trim().toUpperCase())
		.map(_ => expandKeycode(_, keyCodeMap));

	return { meta, keys };
};
