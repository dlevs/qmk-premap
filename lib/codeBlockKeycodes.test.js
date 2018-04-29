'use strict';

const { parseKeycodeBlock } = require('./codeBlockKeycodes');

describe('parseKeycodeBlock()', () => {
	describe('parses', () => {
		test('simple key value pairs', () => {
			expect(parseKeycodeBlock(`
				FOO KC_FOO
				BAR KC_BAR
				SPACE_GUI LGUI(KC_SPACE)
				someCamelCase whyNot
			`)).toMatchObject({
				FOO: 'KC_FOO',
				BAR: 'KC_BAR',
				SPACE_GUI: 'LGUI(KC_SPACE)',
			});
		});

		test('keys with symbols', () => {
			expect(parseKeycodeBlock(`
				␣GUI LGUI(KC_SPACE)
				GUI␣ LGUI(KC_SPACE)

				VOL+ KC_AUDIO_VOL_UP
				VOL- KC_AUDIO_VOL_DOWN

				---- KC_NO
				#### KC_NO
			`)).toMatchObject({
				'␣GUI': 'LGUI(KC_SPACE)',
				'GUI␣': 'LGUI(KC_SPACE)',
				'VOL+': 'KC_AUDIO_VOL_UP',
				'VOL-': 'KC_AUDIO_VOL_DOWN',
				'----': 'KC_NO',
				'####': 'KC_NO',
			});
		});

		test('multiple key expansion', () => {
			expect(parseKeycodeBlock(`
				⏎ ⌤ ENT KC_ENTER
				foo   bar	 KC_FOO
				SHFT KC_SHIFT
			`)).toMatchObject({
				'⏎': 'KC_ENTER',
				'⌤': 'KC_ENTER',
				ENT: 'KC_ENTER',
				foo: 'KC_FOO',
				bar: 'KC_FOO',
				SHFT: 'KC_SHIFT',
			});
		});

		test('values with spaces', () => {
			expect(parseKeycodeBlock(`
				SLWR LT(_LOWER, KC_SPACE)
				FOO MT(MOD_RSFT | MOD_RGUI, KC_FOO)
				BAR MT(MOD_RSFT		|   MOD_RGUI,   KC_BAR )
				( KC_LEFT_PAREN
				) KC_RIGHT_PAREN
				`)).toMatchObject({
				SLWR: 'LT(_LOWER, KC_SPACE)',
				FOO: 'MT(MOD_RSFT | MOD_RGUI, KC_FOO)',
				BAR: 'MT(MOD_RSFT		|   MOD_RGUI,   KC_BAR )',
				'(': 'KC_LEFT_PAREN',
				')': 'KC_RIGHT_PAREN',
			});
			expect(parseKeycodeBlock(`
				) foo KC_BAR
			`)).toMatchObject({
				')': 'KC_BAR',
				foo: 'KC_BAR',
			});
			expect(parseKeycodeBlock(`
				) foo LT(_LOWER, KC_SPACE)
			`)).toMatchObject({
				')': 'LT(_LOWER, KC_SPACE)',
				foo: 'LT(_LOWER, KC_SPACE)',
			});
			expect(parseKeycodeBlock(`
				foo ) LT(_LOWER, KC_SPACE)
			`)).toMatchObject({
				')': 'LT(_LOWER, KC_SPACE)',
				foo: 'LT(_LOWER, KC_SPACE)',
			});
		});
	});
});
