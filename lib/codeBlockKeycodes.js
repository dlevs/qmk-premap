'use strict';

// TODO: be consistent with casing of keycodes vs keyCodes
// TODO: check for duplicates keys

/**
 * Parse keycodes from a string.
 *
 * @example
 * parseKeycodeBlock(`
 *     A KC_A
 *     B KC_B
 *     ⏎ ENT KC_ENTER
 * `);
 * // { A: 'KC_A', B: 'KC_B', '⏎': 'KC_ENTER', ENT: 'KC_ENTER' }
 *
 * @param {String} block
 * @returns {Object}
 */
exports.parseKeycodeBlock = block => block
	.split('\n')
	.map((line) => {
		// Allow spaces in value only after start of a function invocation.
		// Otherwise spaces are treated as the delimiter for multiple keys.
		const splitRegex = /\(.+\)/.test(line)
			? /(?=.*\(.+\))\s+/
			: /\s+/;
		const parts = line.trim().split(splitRegex);
		const value = parts.pop();
		const keys = parts
			.map(key => key.trim())
			.filter(key => key !== '');

		return { keys, value };
	})
	.filter(({ keys }) => keys.length)
	.reduce((keyCodes, { keys, value }) => {
		keys.forEach((key) => {
			// eslint-disable-next-line no-param-reassign
			keyCodes[key] = value;
		});

		return keyCodes;
	}, {});
