'use strict';

const glue = require('./glue');

// TODO: Am using '.toMatchObject' elsewhere. Can it be change to '.toEqual'?

describe('glue()', () => {
	test('combines array items separated by the delimiter', () => {
		expect(glue(['a', ':', 'b'], ':')).toEqual(['a:b']);
		expect(glue(['a', 'b', 'c', ':', 'd'], ':')).toEqual(['a', 'b', 'c:d']);
	});

	test('combines array items where the delimiter is at the start or end of a string', () => {
		expect(glue(['a:', 'b'], ':')).toEqual(['a:b']);
		expect(glue(['a', 'b', 'c:', 'd'], ':')).toEqual(['a', 'b', 'c:d']);
		expect(glue(['a', 'b', 'c', ':d'], ':')).toEqual(['a', 'b', 'c:d']);
	});


	test('does not combine where the delimiter is not sandwiched between other characters', () => {
		expect(glue(['a', 'b', ':'], ':')).toEqual(['a', 'b', ':']);
		expect(glue([':', 'a', 'b'], ':')).toEqual([':', 'a', 'b']);
		expect(glue([':', 'a', 'b', 'c:', 'd', ':'], ':')).toEqual([':', 'a', 'b', 'c:d', ':']);
	});
});
