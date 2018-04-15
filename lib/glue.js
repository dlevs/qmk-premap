
'use strict';

// TODO: rename
const glue = (array, str) => {
	const output = [];
	let i = 0;

	while (i < array.length) {
		let char = array[i];

		while (array[i + 1] && (char.endsWith(str) || array[i + 1].startsWith(str))) {
			const isFirst = i === 0;
			const nextIsLast = (i + 1) === (array.length - 1);
			const shouldSkip = (
				(isFirst && char === str) ||
				(nextIsLast && array[i + 1] === str)
			);

			if (!shouldSkip) {
				char += array[i + 1];
				i++;
			} else {
				break;
			}
		}

		output.push(char);
		i++;
	}

	return output;
};

module.exports = glue;
