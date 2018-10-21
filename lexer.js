const Lexer = {};

$(document).ready(()=>{
	Lexer = new Lexer();
	Lexer.init(parserRuleset);
});

class Lexer {

	constructor(){
		this._tokens = {}
		this._rules = {};
		this._tokenTree = {}
	}

	init(ruleset){
		/**
		 * Parse the ruleset.js file into the Parser
		 * tokens matrix, rules matrix, and markes rules as
		 * repeating.
		 */
		this._parseRulset(Ruleset);
	 }

	_parseRulset(ruleset){
		for(const subruleName in ruleset){
			const subruleString = ruleset[subruleName];

			let currentBranch = [];
			let currentPart = "";
			let parsingRule = false;
			let previousChar = '';
			let repeats = false;
			let optional = false;
			let name = "";

			for(const char of subruleString){
				if(char === '<' && previousChar !== '\\'){
					if(currentPart !== ""){
						currentBranch.push(currentPart);
						currentPart = "";
					}
					parsingRule = true;
				} else if(char === '>' && previousChar !== '\\'){
					if(currentPart !== ""){
						currentBranch.push(new Rule(currentPart, repeats, optional));
						currentPart = "";
					}
					repeats = false;
					optional = false;
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
				} else if(parsingRule && char === '?' && previousChar !== '\\') {
					optional = true;
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

/*
class TokenTree extends Tree {
	constructor(tokens){
		super();
		if(tokens) this.construct(tokens);
	}

	construct(tokens){
		this.root = new Node(undefined, undefined, {});

		for(const tokenName in tokens.matrix()){
			for(const tokenBranchi in tokens.getBranch(tokenName)){
				const tokenBranch = tokens.get(tokenName, tokenBranchi)
				for(const tokenLeaf of tokenBranch){
					let currentNode = this.root;
					for(const char of tokenLeaf){
						if(!currentNode.children[char]){
							currentNode.children[char] = new Node(currentNode, [], {
								content: undefined,
								branch: tokenBranchi,
							});
						}
						currentNode = currentNode.children[char];
					}
					if(currentNode.content && tokenLeaf !== "")
						throw new ParseException(`Duplicate token "${tokenLeaf}" in subrules "${currentNode.content}" and "${tokenName}"`);
					currentNode.content = tokenName;
				}
			}
		}
	}
}
*/

class LexerException extends Error {

	constructor(...args){
		super(...args);
	}
}
