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
			const modifierCodes = [];
			let isSingleTap = false;
			let isDoubleTap = false;

			if (key.length > 1) {
				let i = 0;
				while (i < key.length - 1) {
					const char = key[i];

					if (i === 1) {
						if (char === '.') {
							isSingleTap = true;
							i++;
							break;
						} else if (char === ':') {
							isDoubleTap = true;
							i++;
							break;
						}
					}
					/*
					// TODO: Use split instead of above method
						Mod tap
						⌘|␣
						⌘|UP

						Tap dance
						⇧:⇪
						⇧:UP
						A:⇧A

						ACTION_TAP_DANCE_DOUBLE(kc1 kc2)

						One shot
						⇧~
						⇧|⇧~:⇪
					*/

					if (!MODIFIER_KEYS[char]) break;

					modifierCodes.push(char);
					i++;
				}

				key = key.substr(i, key.length - i);
			}

			if (keyCodes[key]) {
				key = keyCodes[key];
			} else if (key === '') {
				key = 'KC_TRNS';
			}

			const modifiers = modifierCodes.map(code => MODIFIER_KEYS[code]);

			if (isSingleTap) {
				key = `${modifiers[0]}_T(${key})`;
			} else if (isDoubleTap) {
				key = `${modifiers[0]}_T(${key})`;
			} else {
				modifiers.forEach((modifier) => {
					key = `R${modifier}(${key})`;
				});
			}

			return key;
		});

	return { meta, keys };
};
