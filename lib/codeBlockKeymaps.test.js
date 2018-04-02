'use strict';

const { parseKeymapBlock } = require('./codeBlockKeymaps');

describe('parseKeymapBlock()', () => {

	describe('parses', () => {
		test('keymap with single letter keys', () => {
			expect(parseKeymapBlock('│ A  │ B  │ C  │')).toMatchObject({
				keys: ['KC_A', 'KC_B', 'KC_C'],
			});
		});

		test('keymap with multiple letter keys', () => {
			expect(parseKeymapBlock('│END │ESC │HOME│')).toMatchObject({
				keys: ['KC_END', 'KC_ESC', 'KC_HOME'],
			});
		});

		test('keymap with variable whitespace', () => {
			expect(parseKeymapBlock('│A   │ B  │  C │   D│ FOO│BAR │')).toMatchObject({
				keys: ['KC_A', 'KC_B', 'KC_C', 'KC_D', 'KC_FOO', 'KC_BAR'],
			});
		});

		test('multiline keymap', () => {
			expect(parseKeymapBlock(`
				│ A  │ B  │ C  │
				│ D  │ E  │ F  │
			`)).toMatchObject({
				keys: ['KC_A', 'KC_B', 'KC_C', 'KC_D', 'KC_E', 'KC_F'],
			});
		});

		test('multiline keymap with decoration', () => {
			expect(parseKeymapBlock(`
				┌────┬────┬────┐
				│ A  │ B  │ C  │
				├────┼────┼────┤
				│ D  │ E  │ F  │
				└────┴────┴────┘
			`)).toMatchObject({
				keys: ['KC_A', 'KC_B', 'KC_C', 'KC_D', 'KC_E', 'KC_F'],
			});
		});

		test('multiline and multitable keymap with decoration', () => {
			expect(parseKeymapBlock(`
				┌────┬────┬────┐  ┌────┬────┬────┐
				│ A  │ B  │ C  │  │ 1  │ 2  │ 3  │
				├────┼────┼────┤  ├────┼────┼────┤
				│ D  │ E  │ F  │  │ 4  │ 5  │ 6  │
				└────┴────┴────┘  └────┴────┴────┘
			`)).toMatchObject({
				keys: [
					'KC_A', 'KC_B', 'KC_C', 'KC_1', 'KC_2', 'KC_3',
					'KC_D', 'KC_E', 'KC_F', 'KC_4', 'KC_5', 'KC_6',
				],
			});
		});
	});

	describe('general behaviour', () => {
		test('ignores commented lines', () => {
			expect(parseKeymapBlock(`
				┌────┬────┬────┐
				│ A  │ B  │ C  │
				├────┼────┼────┤
			#	│ D  │ E  │ F  │
				├────┼────┼────┤
				│ G  │ H  │ I  │
				└────┴────┴────┘
			`)).toMatchObject({
				keys: ['KC_A', 'KC_B', 'KC_C', 'KC_G', 'KC_H', 'KC_I'],
			});
		});

		test('uppercases output', () => {
			expect(parseKeymapBlock('│ a  │ b  │ c  │ctrl│')).toMatchObject({
				keys: ['KC_A', 'KC_B', 'KC_C', 'KC_CTRL'],
			});
		});
	});

	describe('modifier keys', () => {
		test('single modifiers are applied', () => {
			expect(parseKeymapBlock(`
				┌────┬────┬────┬────┐
				│ ⇧A │ ⌃B │ ⌥C │ ⌘D │
				└────┴────┴────┴────┘
			`)).toMatchObject({
				keys: ['RSFT(KC_A)', 'RCTL(KC_B)', 'RALT(KC_C)', 'RGUI(KC_D)'],
			});
		});

		test('multiple modifiers are applied', () => {
			expect(parseKeymapBlock(`
				┌────┬────┬────┬────┐
				│ ⌃⇧A│ ⇧⌃B│ ⌥⇧C│⌘⌥⇧D│
				└────┴────┴────┴────┘
			`)).toMatchObject({
				keys: [
					'RSFT(RCTL(KC_A))',
					'RCTL(RSFT(KC_B))',
					'RSFT(RALT(KC_C))',
					'RSFT(RALT(RGUI(KC_D)))',
				],
			});
		});
	});
});
