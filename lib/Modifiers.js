'use strict';

const assert = require('assert');

const MODIFIER_NAMES = {
	'⇧': 'SFT',
	'⌃': 'CTL',
	'⌥': 'ALT',
	'⌘': 'GUI',
};

class Modifier {
	constructor(symbol) {
		this.symbol = symbol;
		this.name = MODIFIER_NAMES[symbol];

		assert(this.name, `Unknown modifier ${this.name}`);
	}

	static isModifierSymbol(symbol) {
		return !!MODIFIER_NAMES[symbol];
	}

	get mod() {
		return `MOD_R${this.name}`;
	}

	wrap(value) {
		return `R${this.name}(${value})`;
	}
}

class Modifiers {
	constructor(symbols) {
		this.symbols = [...symbols];
		this.modifiers = this.symbols.map(symbol => new Modifier(symbol));
	}

	get mod() {
		return this.modifiers
			.map(({ mod }) => mod)
			.join(' | ');
	}

	get length() {
		return this.modifiers.length;
	}

	wrap(key) {
		return this.modifiers.reduce(
			(accum, modifier) => modifier.wrap(accum),
			key,
		);
	}
}

module.exports = {
	Modifier,
	Modifiers,
};
