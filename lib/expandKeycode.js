'use strict';

const { Modifier, Modifiers } = require('./Modifiers');
const {
	MOD_TAP_DELIMITER,
	TAP_DANCE_DELIMITER,
	ONE_SHOT_SUFFIX,
	EMPTY_KEY_CODE,
} = require('./constants');


const getKeyCodeModifiers = (key) => {
	const modifiers = [];

	for (let i = 0; i < key.length - 1; i++) {
		if (!Modifier.isModifierSymbol([key[i]])) {
			break;
		}

		modifiers.push(key[i]);
	}

	return {
		key: key.substr(modifiers.length, key.length - modifiers.length),
		modifiers: new Modifiers(modifiers),
	};
};

const parseKeyCodeSequence = (sequence, keyCodeMap) => {
	let tap = sequence;
	let hold = '';

	const parts = tap.split(MOD_TAP_DELIMITER);

	if (parts.length > 1) {
		[hold, tap] = parts;
	} else {
		[tap] = parts;
	}

	tap = getKeyCodeModifiers(tap);

	tap.key = keyCodeMap[tap.key] || tap.key;

	return {
		tap,
		hold: new Modifiers(hold),
	};
};

// TODO: rename
const stringifyKeyCodeObject = ({ tap, hold }) => {
	const { key, modifiers } = tap;
	let output = key;

	if (key === ONE_SHOT_SUFFIX) {
		output = `OSM(${modifiers.mod})`;
	} else if (modifiers.length) {
		output = modifiers.wrap(output);
	}

	if (hold.length) {
		output = `MT(${hold.mod}, ${output})`;
	}

	return output || EMPTY_KEY_CODE;
};

const expandKeyCode = (sequence, keyCodeMap = {}) => {
	// TODO: tidy
	const rawTapDancePresses = sequence
		.replace(/\s/g, '')
		.split(TAP_DANCE_DELIMITER);

	const tapDancePresses = rawTapDancePresses
		.map(_ => parseKeyCodeSequence(_, keyCodeMap))
		.map(stringifyKeyCodeObject);

	// TODO: Allow for more taps, like `A»B»C`
	const [singleTap, doubleTap] = tapDancePresses;

	return doubleTap
		// TODO: this is wrong. The ACTION_TAP_DANCE_DOUBLE function is used like this:
		// enum {
		//     SHIFT_CAPS = 0
		// };
		// qk_tap_dance_action_t tap_dance_actions[] = {
		//     [SHIFT_CAPS] = ACTION_TAP_DANCE_DOUBLE(KC_LSHIFT, KC_CAPSLOCK)
		// };
		? `ACTION_TAP_DANCE_DOUBLE(${singleTap}, ${doubleTap})`
		: singleTap;
};

module.exports = expandKeyCode;
