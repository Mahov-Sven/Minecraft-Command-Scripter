const parserRuleset = {
	file:
	`<whitespaces>` +
	`<namespaceStatement><whitespaces>` +
	`<importStatements>` +
	`<functionalStatements>` +
	`<whitespaces>`
	,

	functionalStatements: `<functionalStatement_+>`,
	functionalStatement_: `<functionalStatement><whitespaces>`,
	functionalStatement: `<typeStatement>|<operationStatement>|<functionStatement>|<null>`,

	namespaceStatement: `<namespaceToken> <name>;`,
	namespaceToken: `namespace`,

	importStatements: `<importStatement_+>`,
	importStatement_: `<importStatement><whitespaces>`,
	importStatement: `<importToken> <name>;`,
	importToken: `import`,

	typeStatement: `<typeToken> <name>(<typeParameters>);`,
	typeToken: `type`,

	operationStatement: `<operationToken> <name>(<parameters>){<codeContent>}`,
	operationToken: `operation`,

	functionStatement: `<functionToken> <name>(<parameters>){<codeContent>}`,
	functionToken: `function`,
	testFunctToken: `funct`,

	parameters: `<parameter+>`,
	parameter: `<parameterType> <name>,|<parameterType> <name>`,
	parameterType: `<name>`,

	codeContent: `TODO`,
	returnToken: `return`,

	string: `<character+>`,
	character: `<nameChar>|<whitespace>|,|\\<|.|\\>|/|?|;|:|'|"|[|{|]|}|=|+|!|@|#|$|%|^|&|*|(|)|\\|\|`,
	whitespaces: `<whitespace+>`,
	whitespace: ` |\n|	|<null>`,

	name: `<nameChar+>`,
	nameChar: `<alpha>|<number>|-|_`,

	alphanumerics: `<alphanumeric+>`,
	alphanumeric: `<alpha>|<number>`,
	alphas: `<alpha+>`,
	alpha: `<lowerAlpha>|<upperAlpha>`,
	lowerAlpha: `a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z`,
	upperAlpha: `A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z`,

	decimal: `<numbers>.<numbers>`,
	numbers: `<number+>`,
	number: `0|1|2|3|4|5|6|7|8|9`,
};
