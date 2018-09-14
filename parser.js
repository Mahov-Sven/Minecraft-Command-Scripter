$(document).ready(()=>{
	const parser = new Parser();
	parser.init(parserRuleset);
});

class Parser {

	constructor(){
		this.tokens = {};
		this.rules = {};
	}

	init(ruleset){
		for(const subruleName in ruleset){
			const subruleString = ruleset[subruleName];

			let subrule = new Subrule();
			subrule.parse(subruleString);
			if(subrule.isToken) this.tokens[subruleName] = subrule;
			else this.rules[subruleName] = subrule;
		}
		console.log(this);

		const parseTree = this.parseIntoTree(parserTestCode);
		console.log(parseTree);
	}

	parseIntoTree(code){
		const parseTree = new ParseTree();
		const tokenTree = new TokenTree(this.tokens);

		return parseTree;
	}

	_listTokenOptions(){
		const tokenOptions = {};
		for(const tokenName in this.tokens){
			const currentTokenOptions = [];
			for(const part in this.tokens[tokenName].parts){
				currentTokenOptions.push(part);
			}
			tokenOptions[tokenName] = currentTokenOptions;
		}
		return tokenOptions;
	}
}

class Subrule {
	constructor(){
		this.parts = [];
		this.isToken = true;
	}

	parse(subruleString){
		let currentBranch = []
		let currentPart = new Token();
		let previousChar = '';
		for(const char of subruleString){
			if(char === '<' && previousChar !== '\\'){
				if(currentPart.content !== "") currentBranch.push(currentPart);
				currentPart = new Rule();
				this.isToken = false;
			} else if(char === '>' && previousChar !== '\\'){
				if(currentPart.content !== "") currentBranch.push(currentPart);
				currentPart = new Token();

			} else if(char === '|' && previousChar !== '\\') {
				if(currentPart.content !== "") currentBranch.push(currentPart);
				if(currentBranch.length > 0) this.parts.push(currentBranch);
				currentPart = new Token();
				currentBranch = [];
			} else {
				currentPart.add(char);
			}
			previousChar = char;
		}
		currentBranch.push(currentPart);
		this.parts.push(currentBranch);
	}
}

class Token {
	constructor(){
		this.content = "";
	}

	add(char){
		this.content += char;
	}
}

class Rule {
	constructor(){
		this.content = "";
	}

	add(char){
		this.content += char;
	}
}

class Tree {
	constructor(){
		this.root = this._node(undefined, []);
	}

	_node(parent, children){
		return {parent: parent, children: children};
	}
}

class ParseTree extends Tree {
	constructor(){
		super();
	}
}

class TokenTree extends Tree {
	constructor(tokens){
		super();
		
	}
}
