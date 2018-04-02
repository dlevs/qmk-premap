'use strict';

const program = require('commander');
const processKeymapFiles = require('./processKeymapFiles');
const { version, name, description } = require('../package');

/**
 * Parse arguments from the CommandLine.
 *
 * @return {Object}
 */
const parseCommandLineArgs = () => {
	program
		.version(version)
		.description(description)
		.usage('[options] <file ...>')
		.option('-o, --output [path]', 'filepath specifying where to write the output file')
		.on('--help', () => {
			const l = console.log;

			l();
			l('  Examples:');
			l();
			l(`    $ ${name} -o ./dist/keymap.c ./keymaps.md ./keycodes.md`);
			l();
		})
		.parse(process.argv);

	if (!program.args.length) program.help();

	return program;
};

exports.initFromCommandLine = () => {
	const { args, output = './dist/keymap.c' } = parseCommandLineArgs();
	processKeymapFiles(args, output);
};
