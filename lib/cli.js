'use strict';

const program = require('commander');
const chokidar = require('chokidar');
// TODO: move
const logger = require('bucker').createLogger({
	console: {
		format: 'QMK-PREMAP :level :time :data',
		timestamp: 'HH:mm:ss',
	},
});
const processKeymapFiles = require('./processKeymapFiles');
const { version, name, description } = require('../package');

logger.info('Starting')
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
		.option('-w, --watch [path]', 'watch source files and recompile when they change')
		.on('--help', () => {
			const l = console.log;

			l();
			l('  Examples:');
			l();
			l(`    $ ${name} -o ./dist/keymap.c ./keymaps.md ./keycodes.md`);
			l();
		})
		.parse(process.argv);

	return program;
};

exports.initFromCommandLine = () => {
	const { args, watch, output = './dist/_keymap.c' } = parseCommandLineArgs();

	// If no arguments supplied, use the README in the current directory.
	if (args.length === 0) {
		args.push('./README.md');
	}

	if (watch) {
		// Watch everything in this directory, and 2 levels up
		chokidar
			.watch(['./*', '../../*'], { persistent: true })
			.on('change', (path) => {
				logger.info(path);
				processKeymapFiles(args, output);
			});
	}


	processKeymapFiles(args, output);
};
