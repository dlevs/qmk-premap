'use strict';

const mapValues = require('lodash/mapValues');

const MOD_TAP_DELIMITER = '|';
const TAP_DANCE_DELIMITER = ':';
const ONE_SHOT_SUFFIX = '…';
const ONE_SHOT_REGEX = new RegExp(`${ONE_SHOT_SUFFIX}$`);
const MODIFIER_KEYS = mapValues(
	{
		'⇧': 'SFT',
		'⌃': 'CTL',
		'⌥': 'ALT',
		'⌘': 'GUI',
	},
	value => ({
		wrap: _ => `R${value}(${_})`,
		mod: `MOD_R${value}`,
	}),
);

const getModifierCharMod = char => MODIFIER_KEYS[char].mod;
const expandModifiers = (key, hold) => {
	const modifierCodes = [];
	let output = key;
	let isOneShot = false;

	if (output.length > 1 && output.endsWith(ONE_SHOT_SUFFIX)) {
		output = output.replace(ONE_SHOT_REGEX, '');
		isOneShot = true;
	}

	const indexToStopCheckingForModifiers = isOneShot
		? output.length
		: output.length - 1;

	let i;
	for (i = 0; i < indexToStopCheckingForModifiers; i++) {
		if (!MODIFIER_KEYS[output[i]]) {
			break;
		}

		modifierCodes.push(output[i]);
	}

	output = output.substr(i, output.length - i);

	if (isOneShot) {
		output = `OSM(${modifierCodes.map(getModifierCharMod).join(' | ')})`;
	} else {
		const modifiers = modifierCodes.map(code => MODIFIER_KEYS[code]);
		modifiers.forEach((modifier) => {
			output = modifier.wrap(output);
		});
	}


	// TODO: Move this out of fn
	if (hold) {
		const modifierKeys = [...hold].map(getModifierCharMod);
		output = `MT(${modifierKeys.join(' | ')}, ${output})`;
	}

	return output;
};

const parseKeycodeComponents = (str) => {
	let tap = str.replace(/\s/g, '');
	let hold = null;

	if (tap.includes(MOD_TAP_DELIMITER)) {
		[hold, tap] = tap.split(MOD_TAP_DELIMITER);
	}

	return { tap, hold };
};

const expandKeycode = (str) => {
	const tapDancePresses = str
		.split(TAP_DANCE_DELIMITER)
		.map(parseKeycodeComponents)
		.map(({ tap, hold }) => expandModifiers(tap, hold));

	const [singleTap, doubleTap] = tapDancePresses;

	return doubleTap
		? `ACTION_TAP_DANCE_DOUBLE(${singleTap}, ${doubleTap})`
		: singleTap;
};

module.exports = expandKeycode;
