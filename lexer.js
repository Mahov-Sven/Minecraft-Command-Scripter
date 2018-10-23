let lexer;

$(document).ready(()=>{
	lexer = new Lexer();
	lexer.init(ruleset);
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
		this._parseRulset(ruleset);
	 }

	_parseRulset(ruleset){
		for(const subruleName in ruleset){
			const subruleString = ruleset[subruleName];

			let currentBranch = [];
			let collectedChars = "";
			let parsingRule = false;
			let previousChar = '';
			let rule = {};

			for(const char of subruleString){
				if(char === '<' && previousChar !== '\\'){
					if(collectedChars !== ""){
						currentBranch.push(collectedChars);
						collectedChars = "";
					}
					parsingRule = true;
				} else if(char === ':' && previousChar !== '\\'){
					if(collectedChars.length === 0)
						throw new LexerException(`Rule name ended early in subrule '${subruleName}'`);
					rule.name = collectedChars;
					collectedChars = "";
				} else if(char === '>' && previousChar !== '\\'){
					if(collectedChars.length === 0)
						throw new LexerException(`Rule name ended early in subrule '${subruleName}'`);
					rule._name = collectedChars;
					currentBranch.push(rule);
					collectedChars = "";
					rule = {};
				} else if(char === '|' && previousChar !== '\\') {
					if(collectedChars !== ""){
						currentBranch.push(collectedChars);
						collectedChars = "";
					}
					if(parsingRule) this._rules[subruleName] = currentBranch;
					else this._tokens[subruleName] = currentBranch;
					currentBranch = [];
					parsingRule = false;
				} else if(parsingRule && char === '+' && previousChar !== '\\') {
					rule.repeats = true;
				} else if(parsingRule && char === '?' && previousChar !== '\\') {
					rule.optional = true;
				} else if(char !== '\\' || previousChar === '\\'){
					collectedChars += char;
				}
				previousChar = char;
			}
			if(collectedChars !== "") currentBranch.push(collectedChars);
			if(currentBranch.length > 0){
				if(parsingRule) this._rules[subruleName] = currentBranch;
				else this._tokens[subruleName] = currentBranch;
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
