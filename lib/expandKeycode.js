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
	// TODO: move string check out of fn
	if (typeof key !== 'string') return key;
	const modifierCodes = [];
	let isOneShot = false;

	key = key.trim();

	if (key.length > 1 && key.endsWith(ONE_SHOT_SUFFIX)) {
		key = key.replace(ONE_SHOT_REGEX, '');
		isOneShot = true;
	}

	const indexToStopCheckingForModifiers = isOneShot
		? key.length
		: key.length - 1;

	let i;
	for (i = 0; i < indexToStopCheckingForModifiers; i++) {
		if (!MODIFIER_KEYS[key[i]]) {
			break;
		}

		modifierCodes.push(key[i]);
	}

	key = key.substr(i, key.length - i);

	if (isOneShot) {
		key = `OSM(${modifierCodes.map(getModifierCharMod).join(' | ')})`;
	} else {
		const modifiers = modifierCodes.map(code => MODIFIER_KEYS[code]);
		modifiers.forEach((modifier) => {
			key = modifier.wrap(key);
		});
	}

	if (hold) {
		const modifierKeys = [...hold].map(getModifierCharMod);
		key = `MT(${modifierKeys.join(' | ')}, ${key})`;
	}

	return key;
};

const parseKeycodeComponents = (str) => {
	let singleTap = str;
	let doubleTap = null;
	let singleHold = null;
	let doubleHold = null;

	if (singleTap.includes(TAP_DANCE_DELIMITER)) {
		[singleTap, doubleTap] = singleTap.split(TAP_DANCE_DELIMITER);
	}

	// TODO: Tidy this up
	if (singleTap.includes(MOD_TAP_DELIMITER)) {
		[singleHold, singleTap] = singleTap.split(MOD_TAP_DELIMITER);
	}

	if (doubleTap && doubleTap.includes(MOD_TAP_DELIMITER)) {
		[doubleHold, doubleTap] = doubleTap.split(MOD_TAP_DELIMITER);
	}

	return {
		singleTap,
		doubleTap,
		singleHold,
		doubleHold,
	};
};

const expandKeycode = (str) => {
	// TODO: Use mapValues here + const
	let { singleTap, doubleTap, singleHold, doubleHold } = parseKeycodeComponents(str);

	singleTap = expandModifiers(singleTap, singleHold);
	doubleTap = expandModifiers(doubleTap, doubleHold);

	return doubleTap
		? `ACTION_TAP_DANCE_DOUBLE(${singleTap}, ${doubleTap})`
		: singleTap;
};

module.exports = expandKeycode;
