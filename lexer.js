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
			this._rules[subruleName] = [];
			this._tokens[subruleName] = [];

			let currentBranch = [];
			let collectedChars = "";
			let withinRule = false;
			let parsingRule = false;
			let previousChar = '';
			let rule = new Rule();

			for(const char of subruleString){
				if(char === '<' && previousChar !== '\\'){
					if(collectedChars !== ""){
						currentBranch.push(collectedChars);
						collectedChars = "";
					}
					parsingRule = true;
					withinRule = true;
				} else if(char === ':' && previousChar !== '\\' && withinRule){
					if(collectedChars.length === 0)
						throw new LexerException(`Rule name ended early in subrule '${subruleName}'`);

					rule.name = collectedChars;
					collectedChars = "";
				} else if(parsingRule && char === '+' && previousChar !== '\\' && withinRule) {
					rule.repeats = true;
				} else if(parsingRule && char === '?' && previousChar !== '\\' && withinRule) {
					rule.optional = true;
				} else if(char === '>' && previousChar !== '\\'){
					if(collectedChars.length === 0)
						throw new LexerException(`Rule ended early in subrule '${subruleName}'`);

					rule._name = collectedChars;
					if(rule.name === undefined) rule.name = rule._name;
					currentBranch.push(rule);
					collectedChars = "";
					rule = new Rule();
					withinRule = false;
				} else if(char === '|' && previousChar !== '\\') {
					if(collectedChars !== ""){
						currentBranch.push(collectedChars);
						collectedChars = "";
					}
					if(parsingRule) this._rules[subruleName].push(currentBranch);
					else this._tokens[subruleName].push(currentBranch[0]);
					currentBranch = [];
					parsingRule = false;
				} else if(char !== '\\' || previousChar === '\\'){
					collectedChars += char;
				}
				previousChar = char;
			}
			if(collectedChars !== "") currentBranch.push(collectedChars);
			if(currentBranch.length > 0){
				if(parsingRule) this._rules[subruleName].push(currentBranch);
				else this._tokens[subruleName].push(currentBranch[0]);
			}
			if(this._rules[subruleName].length === 0) delete this._rules[subruleName];
			if(this._tokens[subruleName].length === 0) delete this._tokens[subruleName];
		}
		console.log(this);

		this._tokenTree.construct(this._tokens);
		console.log(this._tokenTree);
	}
}

class Rule {
	constructor(){
		this.name;
		this._name;
		this.optional = false;
		this.repeats = false;
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
