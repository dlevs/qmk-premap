'use strict';

// Dependencies
//------------------------------------------
const fs = require('fs-extra');
const path = require('path');
const assert = require('assert');
const { getMarkdownCodeBlocks } = require('./util');
const { parseKeycodeBlock } = require('./codeBlockKeycodes');
const { parseKeymapBlock } = require('./codeBlockKeymaps');

const DEFAULT_PATHS = [
	path.join(__dirname, './defaultKeycodes.md'),
];

// TODO: add logging.

const { spawn } = require('child-process-promise');




// TODO: Move me
const compile = async () => {
	const cwd = process.cwd();
	const pathParts = cwd.split(path.sep);
	const layout = pathParts[pathParts.length - 1];
	const keyboard = pathParts[pathParts.length - 3];
	const returnCwd = () => process.chdir(cwd);

	process.chdir('../../../../');

	return spawn('make', [`${keyboard}:${layout}`], { stdio: 'inherit' })
		.then(returnCwd)
		// TODO: Use .finally() when it's available.
		.catch(returnCwd);
};

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
	await compile();

	console.log('done!')
};

module.exports = processKeymapFiles;
