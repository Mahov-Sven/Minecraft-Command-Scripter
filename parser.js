$(document).ready(()=>{
	const parser = new Parser();
	parser.init(parserRuleset);
});

class Parser {

	constructor(){
		this._tokens = new BiMatrix();
		this._rules = new BiMatrix();
		this._repeatingRules = new Set();
		this._tokenTree = new TokenTree();
		this._parseTree = new ParseTree();
	}

	init(ruleset){
		/**
		 * Parse the ruleset.js file into the Parser
		 * tokens matrix, rules matrix, and markes rules as
		 * repeating.
		 */
		for(const subruleName in ruleset){
			const subruleString = ruleset[subruleName];

			let currentBranch = [];
			let currentPart = "";
			let parsingRule = false;
			let previousChar = '';
			let repeats = false;

			for(const char of subruleString){
				if(char === '<' && previousChar !== '\\'){
					if(currentPart !== ""){
						currentBranch.push(currentPart);
						currentPart = "";
					}
					parsingRule = true;
				} else if(char === '>' && previousChar !== '\\'){
					if(currentPart !== ""){
						currentBranch.push(currentPart);
						if(repeats) this._repeatingRules.add(currentPart);
						currentPart = "";
					}
					repeats = false;
				} else if(char === '|' && previousChar !== '\\') {
					if(currentPart !== ""){
						currentBranch.push(currentPart);
						currentPart = "";

					}
					if(parsingRule) this._rules.push(subruleName, currentBranch);
					else this._tokens.push(subruleName, currentBranch);
					currentBranch = [];
					parsingRule = false;
				} else if(parsingRule && char === '+' && previousChar !== '\\') {
					repeats = true;
				} else if(char !== '\\' || previousChar === '\\'){
					currentPart += char;
				}
				previousChar = char;
			}
			if(currentPart !== "") currentBranch.push(currentPart);
			if(currentBranch.length > 0){
				if(parsingRule) this._rules.push(subruleName, currentBranch);
				else this._tokens.push(subruleName, currentBranch);
			}
		}
		console.log(this);

		this._tokenTree.construct(this._tokens);
		console.log(this._tokenTree);

		this._parseTree.construct(this._tokenTree, this._rules, parserTestCode);
		console.log(this._parseTree);
	}

	parseIntoTree(code){
		const parseTree = new ParseTree();

		return parseTree;
	}
}

class BiMatrix {
	constructor(){
		this._matrix = {};
		this._inverse = {};
	}

	matrix(){
		return this._matrix;
	}

	inverse(){
		return this._inverse;
	}

	get(matrixKey, branchIndex){
		return this._matrix[matrixKey][branchIndex];
	}

	getInverse(inverseKey, branchIndex){
		return this._inverse[inverseKey][branchIndex];
	}

	getBranch(matrixKey){
		return this._matrix[matrixKey];
	}

	getInverseBranch(inverseKey){
		return this._inverse[inverseKey];
	}

	push(matrixKey, inverseBranch){
		if(!this._matrix[matrixKey]) this._matrix[matrixKey] = [inverseBranch];
		else this._matrix[matrixKey].push(inverseBranch);
		for(let inverseIndex = 0; inverseIndex < inverseBranch.length; inverseIndex++){
			const inverseKey = inverseBranch[inverseIndex];
			if(!this._inverse[inverseKey]) this._inverse[inverseKey] = [];
			if(!this._inverse[inverseKey][inverseIndex]) this._inverse[inverseKey][inverseIndex] = [matrixKey];
			else this._inverse[inverseKey][inverseIndex].push(matrixKey);
		}
	}
}

class Tree {
	constructor(){
		this.root = new Node();
	}

	construct(){/* STUB */}
}

class Node {
	constructor(parent=undefined, content=undefined, children=[]) {
		this.parent = parent;
		this.content = content;
		this.children = children;
	}
}

class ParseTree extends Tree {
	constructor(tokenTree, code){
		super();
		if(tokenTree && code) this.construct(tokenTree, code);
	}

	construct(tokenTree, rules, code){
		const tokenArray = [];
		let currentTokenNode = tokenTree.root;
		let currentStartCharIndex = 0;
		let currentSection = "";
		for(let chari = 0; chari < code.length; chari++){
			let char = code[chari];
			if(currentTokenNode.children[char]){
				currentTokenNode = currentTokenNode.children[char];
				currentSection += char;
			} else {
				if(!currentTokenNode.content){
					currentTokenNode = tokenTree.root.children[code[currentStartCharIndex]];
					if(!currentTokenNode.content)
						throw new ParseError(`Unknown token ${currentSection}`);
					currentSection = code[currentStartCharIndex];
					chari = currentStartCharIndex + 1;
					char = code[chari];
				}

				const parseNode = new Node(undefined, currentTokenNode.content, [currentSection]);
				tokenArray.push(parseNode);
				currentTokenNode = tokenTree.root.children[char];
				currentSection = char;
				currentStartCharIndex = chari;
			}
		}
		console.log(tokenArray);

		let parentRuleFound = false;
		let iteration = 0;
		let consecutivePossibilities = new Set();
		let possibilities = new Set();
		do {
			for(let tokenIndex = 0; tokenIndex < tokenArray.length; tokenIndex++){
				const rule = tokenArray[tokenIndex];
				const parentRules =
				console.log(token);
				if(!token.content)
					throw new ParseError(`No Existing Parent to Rule '${token}'`);

				for(const parentRule)
			}
			console.log(iteration++);
		} while(parentRuleFound && iteration < 100);

		console.log(tokenArray);
	}
}

class TokenTree extends Tree {
	constructor(tokens){
		super();
		if(tokens) this.construct(tokens);
	}

	construct(tokens){
		this.root = new Node(undefined, undefined, {});

		for(const tokenName in tokens.matrix()){
			for(const tokenBranch of tokens.getBranch(tokenName)){
				for(const tokenLeaf of tokenBranch){
					let currentNode = this.root;
					for(const char of tokenLeaf){
						if(!currentNode.children[char]){
							currentNode.children[char] = new Node(currentNode, undefined, {});
						}
						currentNode = currentNode.children[char];
					}
					if(currentNode.content && tokenLeaf !== "")
						throw new ParseError(`Duplicate token "${tokenLeaf}" in subrules "${currentNode.content}" and "${tokenName}"`);
					currentNode.content = tokenName;
				}
			}
		}
	}
}

class ParseError extends Error {

	constructor(...args){
		super(...args);
	}
}
