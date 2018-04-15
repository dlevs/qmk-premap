'use strict';

const { Modifier, Modifiers } = require('./Modifiers');
const glue = require('./glue');
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

	const parts = magic(tap, MOD_TAP_DELIMITER);

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

	return output;
};

/// TODO: rename
const magic = (str, splitCharacter) => str
	// TODO: make util fn
	.split(splitCharacter)
	.reduce((accum, value, i) => {
		if (value === '' && accum[i - 1] !== splitCharacter) {
			return accum.concat(splitCharacter);
		}

		return accum.concat(value);
	}, [])
	.filter(value => value !== '');


const expandKeyCode = (sequence, keyCodeMap = {}) => {
	sequence = 	sequence.replace(/\s/g, '');
	// TODO: tidy
	const rawTapDancePresses = glue(magic(sequence, TAP_DANCE_DELIMITER), MOD_TAP_DELIMITER);

	if (!rawTapDancePresses.length) {
		return EMPTY_KEY_CODE;
	}

	const tapDancePresses = rawTapDancePresses
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
