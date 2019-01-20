import { StyleSheet } from 'react-native';

// 传入两个数字，返回两个数字的比例
export const decimalToFraction = (operandA, operandB) => {
	operandA = parseFloat(operandA);
	operandB = parseFloat(operandB);
	if (operandA % 1 !== 0 || operandB % 1 !== 0) {
		operandA = operandA.toString();
		operandB = operandB.toString();
		[operandA, operandB] = proportionallyExpandToInts([operandA, operandB]);
	}
	if (operandA === operandB) return '1 : 1';
	let commonDivisor = 1;
	let finalDivisor = 1;
	let base = operandA < operandB ? operandA : operandB;
	while (++commonDivisor <= base) {
		if (operandA % commonDivisor === 0 && operandB % commonDivisor === 0) {
			base =
				(operandA = operandA / commonDivisor) <
				(operandB = operandB / commonDivisor)
					? operandA
					: operandB;
			finalDivisor *= commonDivisor;
			commonDivisor = 1;
		}
	}
	return {
		proportionA: operandA,
		proportionB: operandB,
		greatestCommonDivisor: finalDivisor,
		result: `The fraction you require is ${operandA} : ${operandB}. Devisor is ${finalDivisor}`
	};
};

export function mergeStyle(props, localStyle) {
	return props.noStyleMerge
		? props.style
		: StyleSheet.flatten([localStyle, props.style]);
}

// 传入一个由代表数字的字符串所构成的数组，将数组中的数字，成比例化整。
// 并返回化整后的数字所构成的数组。
export function proportionallyExpandToInts(floatStringArray) {
	let fractionalLevel = 0;
	return floatStringArray
		.map(floatNumber => {
			if (/(\d+)\.(\d+)/.test(floatNumber)) {
				if (RegExp.$2.length > fractionalLevel) {
					fractionalLevel = RegExp.$2.length;
				}
				return {
					resultStr: RegExp.$1 + RegExp.$2,
					fractionLength: RegExp.$2.length
				};
			} else {
				return {
					resultStr: floatNumber,
					fractionLength: 0
				};
			}
		})
		.map(numberToekn => {
			let spaces = '';
			if (fractionalLevel > numberToekn.fractionLength) {
				spaces = Array(fractionalLevel - numberToekn.fractionLength)
					.fill('0')
					.join('');
			}
			return parseFloat(numberToekn.resultStr + spaces);
		});
}
