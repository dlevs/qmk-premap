'use strict';

const each = require('lodash/each');
const expandKeycode = require('./expandKeycode');
const {
	MOD_TAP_DELIMITER,
	TAP_DANCE_DELIMITER,
} = require('./constants');

const expectedResults = {
	'Pass through': {
		A: 'A',
		B: 'B',
		LSFT: 'LSFT',
		'⌃': '⌃',
		'⌘': '⌘',
		'⌥': '⌥',
		'⇧': '⇧',
	},
	'Empty string is transparent key': {
		'': 'KC_TRANSPARENT',
	},
	Modifier: {
		'⌃A': 'RCTL(A)',
		'⌘B': 'RGUI(B)',
		'⌘⌃': 'RGUI(⌃)',
		'⌘⇧⌃': 'RSFT(RGUI(⌃))',
		'⇧⌥⌃⌘': 'RCTL(RALT(RSFT(⌘)))',
	},
	'Chaining modifiers': {
		'⌃⌘A': 'RGUI(RCTL(A))',
		'⇧⌃⌘B': 'RGUI(RCTL(RSFT(B)))',
		'⇧⌥⌃⌘C': 'RGUI(RCTL(RALT(RSFT(C))))',
	},
	'Mod tap': {
		'⌃|A': 'MT(MOD_RCTL, A)',
		'⌘|B': 'MT(MOD_RGUI, B)',
	},
	'Mod tap with multiple modifiers': {
		'⌘⌥|A': 'MT(MOD_RGUI | MOD_RALT, A)',
		'⌃⇧⌘|B': 'MT(MOD_RCTL | MOD_RSFT | MOD_RGUI, B)',
		'⌥⌃⇧⌘|B': 'MT(MOD_RALT | MOD_RCTL | MOD_RSFT | MOD_RGUI, B)',
	},
	'One shot': {
		'⌘…': 'OSM(MOD_RGUI)',
		'⌃…': 'OSM(MOD_RCTL)',
	},
	'One shot with multiple modifiers': {
		'⌘⌥…': 'OSM(MOD_RGUI | MOD_RALT)',
		'⌥⇧⌃…': 'OSM(MOD_RALT | MOD_RSFT | MOD_RCTL)',
		'⌘⌥⇧⌃…': 'OSM(MOD_RGUI | MOD_RALT | MOD_RSFT | MOD_RCTL)',
	},
	Combinations: {
		'⌘|⌘…': 'MT(MOD_RGUI, OSM(MOD_RGUI))',
		'⌘⌃⌥⇧|⌘…': 'MT(MOD_RGUI | MOD_RCTL | MOD_RALT | MOD_RSFT, OSM(MOD_RGUI))',
		'⇧|A:B': 'ACTION_TAP_DANCE_DOUBLE(MT(MOD_RSFT, A), B)',
		'⇧|⇧…:⌘|⌘…': 'ACTION_TAP_DANCE_DOUBLE(MT(MOD_RSFT, OSM(MOD_RSFT)), MT(MOD_RGUI, OSM(MOD_RGUI)))',
		'⇧|⇧…:⌘⌥⇧⌃|⌘⌥⇧⌃A': 'ACTION_TAP_DANCE_DOUBLE(MT(MOD_RSFT, OSM(MOD_RSFT)), MT(MOD_RGUI | MOD_RALT | MOD_RSFT | MOD_RCTL, RCTL(RSFT(RALT(RGUI(A))))))',
		'⌘|⌘…:⌘⌥⇧⌃|⌘⌥⇧⌃': 'ACTION_TAP_DANCE_DOUBLE(MT(MOD_RGUI, OSM(MOD_RGUI)), MT(MOD_RGUI | MOD_RALT | MOD_RSFT | MOD_RCTL, RSFT(RALT(RGUI(⌃)))))',
	},
	'Whitespace stripping': {
		' ⌃ | A ': 'MT(MOD_RCTL, A)',
		'	⌃	|	A	': 'MT(MOD_RCTL, A)',
		'	⌘	B	': 'RGUI(B)',
		'   ⌘   B   ': 'RGUI(B)',
		'⇧|A : B': 'ACTION_TAP_DANCE_DOUBLE(MT(MOD_RSFT, A), B)',
	},
	'Interpret delimiters as literal characters when appropriate': {
		[MOD_TAP_DELIMITER]: MOD_TAP_DELIMITER,
		[TAP_DANCE_DELIMITER]: TAP_DANCE_DELIMITER,
		[`⌘${MOD_TAP_DELIMITER}${MOD_TAP_DELIMITER}`]: `MT(MOD_RGUI, ${MOD_TAP_DELIMITER})`,
		[`⌘${TAP_DANCE_DELIMITER}${TAP_DANCE_DELIMITER}`]: `ACTION_TAP_DANCE_DOUBLE(⌘, ${TAP_DANCE_DELIMITER})`,
		[`⌘${MOD_TAP_DELIMITER}${TAP_DANCE_DELIMITER}`]: `MT(MOD_RGUI, ${TAP_DANCE_DELIMITER})`,
		[`⌘${TAP_DANCE_DELIMITER}${MOD_TAP_DELIMITER}`]: `ACTION_TAP_DANCE_DOUBLE(⌘, ${MOD_TAP_DELIMITER})`,
		[`${MOD_TAP_DELIMITER}${TAP_DANCE_DELIMITER}${MOD_TAP_DELIMITER}`]: `ACTION_TAP_DANCE_DOUBLE(${MOD_TAP_DELIMITER}, ${MOD_TAP_DELIMITER})`,
		[`${TAP_DANCE_DELIMITER}${MOD_TAP_DELIMITER}${TAP_DANCE_DELIMITER}`]: `MT(${TAP_DANCE_DELIMITER}, ${TAP_DANCE_DELIMITER})`,
	},
};

describe('expandKeycode()', () => {
	each(expectedResults, (group, groupDescription) => {
		describe(groupDescription, () => {
			each(group, (expectedResult, input) => {
				test(input, () => {
					expect(expandKeycode(input)).toBe(expectedResult);
				});
			});
		});
	});
});
