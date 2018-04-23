'use strict';

// Dependencies
//------------------------------------------
const fs = require('fs-extra');
const path = require('path');
const assert = require('assert');
const ora = require('ora');
const { getMarkdownCodeBlocks } = require('./util');
const { parseKeycodeBlock } = require('./codeBlockKeycodes');
const { parseKeymapBlock } = require('./codeBlockKeymaps');

const DEFAULT_PATHS = [
	path.join(__dirname, './defaultKeycodes.md'),
];

// TODO: add logging.

const { exec } = require('child-process-promise');

const getCompileCommand = () => {
	const pathParts = process.cwd().split(path.sep);
	const layout = pathParts[pathParts.length - 1];
	const keyboard = pathParts[pathParts.length - 3];

	return `make ${keyboard}:${layout}`;
};

// TODO: Move me
const execAtQMKRoot = command => exec(`cd ../../../../; ${command};`);

// Functions
//------------------------------------------
const processKeymapFiles = async (inputPaths, outputPath) => {
	const allInputPaths = [
		...DEFAULT_PATHS,
		...inputPaths,
	];
	let keyCodeBlocks = [];
	let keyLayoutBlocks = [];

	for (let i = 0; i < allInputPaths.length; i++) {
		// eslint-disable-next-line no-await-in-loop
		const document = await fs.readFile(allInputPaths[i], 'utf8');

		keyCodeBlocks = keyCodeBlocks.concat(getMarkdownCodeBlocks(document, 'keycodes'));
		keyLayoutBlocks = keyLayoutBlocks.concat(getMarkdownCodeBlocks(document, 'keymap'));
	}

	const keyCodes = Object.assign({}, ...keyCodeBlocks.map(parseKeycodeBlock));
	const keyLayouts = keyLayoutBlocks.map(_ => parseKeymapBlock(_, keyCodes));

	keyLayouts.forEach(({ meta }) => {
		assert(meta.layer, 'The name of a layout must be defined as a comment.');
	});

	const mapLayoutToLine = ({ keys, meta }) => `[${meta.layer}] = LAYOUT(${keys.join(', ')})`;
	const output = `
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
	${keyLayouts.map(mapLayoutToLine).join(',\n	')}
};`.trim();

	await fs.mkdirp(path.dirname(outputPath));
	await fs.writeFile(outputPath, output);


	const spinner = ora('Compiling...').start();

	// TODO: Write util function to wrap promise success/ failure
	await execAtQMKRoot(getCompileCommand())
		.then(() => {
			spinner.succeed('Compiled successfully');
		})
		.catch(({ stderr }) => {
			const indent = ' '.repeat(8);
			const message = stderr.trim()
				.split('\n')
				.map(line => `${indent}${line}`)
				.join('\n');

			spinner.fail('Compilation failed');

			process.stderr.write(`\n\n${message}\n\n\n`);
		});
};

module.exports = processKeymapFiles;
