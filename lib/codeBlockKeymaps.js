'use strict';

const exec = require('execall');
const { getCodeBlockMeta } = require('./util');
const { stripComments } = require('./comments');

const KEY_DELIMITER = '│';
const KEY_REGEX = new RegExp(`${KEY_DELIMITER}(.{4})(?=${KEY_DELIMITER})`, 'g');
const MODIFIER_KEYS = {
	'⇧': 'SFT',
	'⌃': 'CTL',
	'⌥': 'ALT',
	'⌘': 'GUI',
};

exports.parseKeymapBlock = (document, keyCodes = {}) => {
	const meta = getCodeBlockMeta(document);
	const keys = exec(KEY_REGEX, stripComments(document))
		.map(({ sub }) => sub[0].trim().toUpperCase())
		.map((key) => {
			const modifiers = [];
			let isModTap = false;

			if (key.length > 1) {
				let i = 0;
				while (i < key.length - 1) {
					const char = key[i];

					if (i === 1 && char === '/') {
						isModTap = true;
						i++;
						break;
					}

					if (!MODIFIER_KEYS[char]) break;

					modifiers.push(char);
					i++;
				}

				key = key.substr(i, key.length - i);
			}

			key = keyCodes[key] || key;

			if (key === '') {
				key = 'KC_TRNS';
			} else if (!key.startsWith('KC_')) {
				key = `KC_${key}`;
			}

			if (isModTap) {
				key = `${MODIFIER_KEYS[modifiers[0]]}_T(${key})`;
			} else {
				modifiers.forEach((modifier) => {
					key = `R${MODIFIER_KEYS[modifier]}(${key})`;
				});
			}

			return key;
		});

	return { meta, keys };
};
