'use strict';

// Dependencies
//------------------------------------------
const processKeymapFiles = require('./lib/processKeymapFiles');
const { initFromCommandLine } = require('./lib/cli');

// Exports / init
//------------------------------------
if (module.parent) {
	module.exports = processKeymapFiles;
} else {
	initFromCommandLine();
}
