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

		test('keys with symbols', () => {
			expect(parseKeycodeBlock(`
				⏎ ⌤ ENT KC_ENTER
				foo bar KC_FOO
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
	});
});
