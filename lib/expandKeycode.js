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
	let tap = sequence.replace(/\s/g, '');
	let hold = '';

	if (tap.includes(MOD_TAP_DELIMITER)) {
		[hold, tap] = tap.split(MOD_TAP_DELIMITER);
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
	} else if (output === '') {
		output = EMPTY_KEY_CODE;
	} else if (modifiers.length) {
		output = modifiers.wrap(output);
	}

	if (hold.length) {
		output = `MT(${hold.mod}, ${output})`;
	}

	return output;
};

const expandKeyCode = (sequence, keyCodeMap = {}) => {
	const tapDancePresses = sequence
		.split(TAP_DANCE_DELIMITER)
		.map(_ => parseKeyCodeSequence(_, keyCodeMap))
		.map(stringifyKeyCodeObject);

	// TODO: Allow for more taps, like `A:B:C`
	const [singleTap, doubleTap] = tapDancePresses;

	return doubleTap
		? `ACTION_TAP_DANCE_DOUBLE(${singleTap}, ${doubleTap})`
		: singleTap;
};

module.exports = expandKeyCode;


// expandKeyCode('⌘⌥|⌘b:⌘…');
