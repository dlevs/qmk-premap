'use strict';

const MOD_TAP_DELIMITER = '|';
const TAP_DANCE_DELIMITER = ':';
const ONE_SHOT_SUFFIX = '~';
const MODIFIER_KEYS = {
	'⇧': 'SFT',
	'⌃': 'CTL',
	'⌥': 'ALT',
	'⌘': 'GUI',
};

const expandModifiers = (key) => {
	// TODO: move string check out of fn
	if (typeof key !== 'string') return key;
	const modifierCodes = [];
	let isOneShot = false;

	key = key.trim();

	if (key.length > 1 && key.endsWith(ONE_SHOT_SUFFIX)) {
		key = key.replace(new RegExp(`${ONE_SHOT_SUFFIX}$`), '');
		isOneShot = true;
	}

	if (key.length > 1) {
		let i = 0;
		while (i < key.length - 1) {
			if (!MODIFIER_KEYS[key[i]]) {
				break;
			}

			modifierCodes.push(key[i]);
			i++;
		}

		key = key.substr(i, key.length - i);
	}

	if (isOneShot) {
		key = `OSM(${key})`;
	}

	const modifiers = modifierCodes.map(code => MODIFIER_KEYS[code]);
	modifiers.forEach((modifier) => {
		key = `R${modifier}(${key})`;
	});

	return key;
};

const parseKeycodeComponents = (str) => {
	let singleTap = str;
	let doubleTap = null;
	let hold = null;

	if (singleTap.includes(MOD_TAP_DELIMITER)) {
		[hold, singleTap] = singleTap.split(MOD_TAP_DELIMITER);
	}

	if (singleTap.includes(TAP_DANCE_DELIMITER)) {
		[singleTap, doubleTap] = singleTap.split(TAP_DANCE_DELIMITER);
	}

	return {
		singleTap,
		doubleTap,
		hold
	};
};

const expandKeycode = (str) => {
	// TODO: Use mapValues here + const
	let { singleTap, doubleTap, hold } = parseKeycodeComponents(str);

	singleTap = expandModifiers(singleTap);
	doubleTap = expandModifiers(doubleTap);

	let output = doubleTap
		? `ACTION_TAP_DANCE_DOUBLE(${singleTap} ${doubleTap})`
		: singleTap;

	if (hold) {
		output = `${MODIFIER_KEYS[hold] || hold}_T(${output})`;
	}

	return output;
};

console.log(expandKeycode('⇧|~'));
console.log(expandKeycode('⇧|⇧~:⇪'));
console.log(expandKeycode('⇧:⇪'));
console.log(expandKeycode('A:⇧A'));
