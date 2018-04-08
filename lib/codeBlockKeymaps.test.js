'use strict';

const { parseKeymapBlock } = require('./codeBlockKeymaps');

describe('parseKeymapBlock()', () => {
	describe('parses', () => {
		test('keymap with single letter keys', () => {
			expect(parseKeymapBlock('│ A  │ B  │ C  │')).toMatchObject({
				keys: ['A', 'B', 'C'],
			});
		});

		test('keymap with multiple letter keys', () => {
			expect(parseKeymapBlock('│END │ESC │HOME│')).toMatchObject({
				keys: ['END', 'ESC', 'HOME'],
			});
		});

		test('keymap with variable whitespace', () => {
			expect(parseKeymapBlock('│A   │ B  │  C │   D│ FOO│BAR │')).toMatchObject({
				keys: ['A', 'B', 'C', 'D', 'FOO', 'BAR'],
			});
		});

		test('multiline keymap', () => {
			expect(parseKeymapBlock(`
				│ A  │ B  │ C  │
				│ D  │ E  │ F  │
			`)).toMatchObject({
				keys: ['A', 'B', 'C', 'D', 'E', 'F'],
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
				keys: ['A', 'B', 'C', 'D', 'E', 'F'],
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
					'A', 'B', 'C', '1', '2', '3',
					'D', 'E', 'F', '4', '5', '6',
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
				keys: ['A', 'B', 'C', 'G', 'H', 'I'],
			});
		});

		test('uppercases output', () => {
			expect(parseKeymapBlock('│ a  │ b  │ c  │ctrl│')).toMatchObject({
				keys: ['A', 'B', 'C', 'CTRL'],
			});
		});

		test('extracts comments as meta', () => {
			const result = parseKeymapBlock(`
				# foo: 10
				# bar: Hello
				# camelCase: works
				# snake_case: fine
				# A non meta comment
				# hashes: ### test ###

				┌────┬────┬────┬────┐
				│ A  │ B  │ C  │ D  │
				└────┴────┴────┴────┘
				# bottom: why not?
			`);
			expect(result).toMatchObject({
				keys: ['A', 'B', 'C', 'D'],
				meta: {
					foo: '10',
					bar: 'Hello',
					camelCase: 'works',
					snake_case: 'fine',
					hashes: '### test ###',
					bottom: 'why not?',
				},
			});
			expect(Object.keys(result.meta).length).toBe(6);
		});
	});

	test('uses keymap provided as second parameter', () => {
		expect(parseKeymapBlock('│ A  │ b  │ C  │', {
			A: 'KC_A',
			B: 'KC_B',
			C: 'KC_C',
		})).toMatchObject({
			keys: ['KC_A', 'KC_B', 'KC_C'],
		});
	});

	describe('modifier keys', () => {
		test('single modifiers are applied', () => {
			expect(parseKeymapBlock(`
				┌────┬────┬────┬────┐
				│ ⇧A │ ⌃B │ ⌥C │ ⌘/ │
				└────┴────┴────┴────┘
			`, { '/': 'KC_SLASH' })).toMatchObject({
				keys: ['RSFT(A)', 'RCTL(B)', 'RALT(C)', 'RGUI(KC_SLASH)'],
			});
		});

		test('multiple modifiers are applied', () => {
			expect(parseKeymapBlock(`
				┌────┬────┬────┬────┐
				│⌃⇧A │⇧⌃B │⌥⇧C │⌘⌥⇧/│
				└────┴────┴────┴────┘
			`, { '/': 'KC_SLASH' })).toMatchObject({
				keys: [
					'RSFT(RCTL(A))',
					'RCTL(RSFT(B))',
					'RSFT(RALT(C))',
					'RSFT(RALT(RGUI(KC_SLASH)))',
				],
			});
		});

		test('Mod tap modifiers are applied', () => {
			expect(parseKeymapBlock(`
				┌────┬────┬────┬────┐
				│⇧/A │⌃/B │⌥/C │⌘// │
				└────┴────┴────┴────┘
			`, { '/': 'KC_SLASH' })).toMatchObject({
				keys: ['SFT_T(A)', 'CTL_T(B)', 'ALT_T(C)', 'GUI_T(KC_SLASH)'],
			});
		});
	});
});
