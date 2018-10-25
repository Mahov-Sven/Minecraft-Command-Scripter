const ruleset = {
	file:
	`<ws?>` +
	`<namespaceStatement><ws?>` +
	`<importStatements>` +
	`<functionalStatements>` +
	`<ws?>`
	,

	functionalStatements: `<functionalStatement_+>`,
	functionalStatement_: `<functionalStatement><ws?>`,
	functionalStatement: `<typeStatement>|<operationStatement>|<functionStatement>`,

	namespaceStatement: `<namespaceToken> <name>;`,
	namespaceToken: `namespace`,

	importStatements: `<importStatement_+>`,
	importStatement_: `<importStatement><ws?>`,
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

	mcasm_declarator: `<mcasm_token><ws?>{<ws?>"<mcasm_lines?>"<ws?>};`,
	mcasm_token: `__mcasm__`,
	mcasm_lines: `<mcasm_line+>`,
	mcasm_line: `tp @<selector:mcasm_selector> <x:number> <y:number> <z:number>`,
	mcasm_selector: `s|a|e|r|p`,

	string: `<character+>`,
	character: `<nameChar>|<whitespace>|,|\\<|.|\\>|/|?|;|:|'|"|[|{|]|}|=|+|!|@|#|$|%|^|&|*|(|)|\\|\|`,
	ws: `<whitespace+>`,
	whitespace: ` |\n|	`,

	name: `<nameChar+>`,
	nameChar: `<alpha>|<number>|-|_`,

	alphanumerics: `<alphanumeric+>`,
	alphanumeric: `<alpha>|<number>`,
	alphas: `<alpha+>`,
	alpha: `<lowerAlpha>|<upperAlpha>`,
	lowerAlpha: `a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z`,
	upperAlpha: `A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z`,

	number: `<decimal>|<integers>`,
	decimal: `<integers>.<integers>`,
	integers: `<integers+>`,
	integer: `0|1|2|3|4|5|6|7|8|9`,
};
