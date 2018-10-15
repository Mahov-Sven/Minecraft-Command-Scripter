$(document).ready(()=>{
	const parser = new Parser();
	parser.init(parserRuleset);
});

class Rule {
	constructor(name, repeats, optional){
		this.name = name;
		this.repeats = repeats;
		this.optional = optional;
	}
}

class Parser {

	constructor(){
		this._tokens = new BiMatrix();
		this._rules = new BiMatrix();
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
			let optional = false;

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
	constructor(parent=undefined, children=[], content = {}) {
		this.parent = parent;
		this.children = children;

		for(const field in content){
			this[field] = content[field];
		}
	}
}

class ParseTree extends Tree {
	constructor(tokenTree, code){
		super();
		if(tokenTree && code) this.construct(tokenTree, code);
	}

	construct(tokenTree, rules, code){
		const ruleArray = [];
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
						throw new ParseException(`Unknown token ${currentSection}`);
					currentSection = code[currentStartCharIndex];
					chari = currentStartCharIndex + 1;
					char = code[chari];
				}

				const parseNode = new Node(undefined, [currentSection], {
						rule: currentTokenNode.content,
						//branch: currentTokenNode.branch,
					});
				ruleArray.push(parseNode);
				currentTokenNode = tokenTree.root.children[char];
				currentSection = char;
				currentStartCharIndex = chari;
			}
		}
		console.log(ruleArray);

		const codeStringArray = [];
		for(const ruleNode of ruleArray){
			codeStringArray.push(ruleNode.children[0]);
		}

		console.log(codeStringArray);

		let parentRuleFound = false;
		let iteration = 0;

		let consecPoss = new Map();
		let poss = new Map();
		let parentRuleIndex = 0;
		let parentRuleLength = 0;
		do {
			for(let ruleIndex = 0; ruleIndex < ruleArray.length; ruleIndex++){
				const ruleNode = ruleArray[ruleIndex];
				console.log(parentRuleLength, ruleIndex, ruleNode.rule, ruleNode.branch, consecPoss, poss);
				console.log(codeStringArray);
				console.log(ruleArray);
				if(!ruleNode.rule)
					throw new ParseException(`No Existing Parent to Rule '${ruleNode.rule}'`);

				const parentRules = rules.getInverse(ruleNode.rule, parentRuleLength);
				console.log(parentRules);
				if(parentRules !== undefined){
					for(const parentRule of parentRules){
						if(consecPoss.size === 0){
							let branchPoss = [];
							for(const branchI in rules.getBranch(parentRule)){
								if(rules.get(parentRule, branchI)[0] === ruleNode.rule)
									branchPoss.push(branchI)
							}
							console.log(parentRule, branchPoss);
							poss.set(parentRule, branchPoss);

						} else if (consecPoss.has(parentRule)){
							let branchPoss = [];
							for(const branchI of consecPoss.get(parentRule)){
								if(rules.get(parentRule, branchI)[parentRuleLength] === ruleNode.rule)
									branchPoss.push(branchI);
							}
							console.log(parentRule, branchPoss);
							if(branchPoss.length !== 0)
								poss.set(parentRule, branchPoss);
						}
					}

					let tempSet = consecPoss;
					consecPoss = poss;
					poss = tempSet
					poss.clear();
					parentRuleLength++;
				} else {
					if (consecPoss.size === 0)
						throw new ParseException(`There are no rule possibilities`);

					let parentRules = [];
					for(const rule of consecPoss.keys()) {
						parentRules.push(rule);
					}
					console.log(parentRules);
					console.log(rules.getInverseBranch(codeStringArray.slice(parentRuleIndex, parentRuleIndex + parentRuleLength).join("")));

					if(parentRules.length !== 0){
						const parenRuleNode = new Node(undefined, parentRules);
						for(let ruleNodei = startParentRuleIndex; ruleNodei < ruleIndex; ruleNodei++){
							parenRuleNode.children.push(ruleArray[ruleNodei]);
							ruleArray[ruleNodei].parent = parenRuleNode;
						}
						console.log("New Node", parenRuleNode);
					}

					ruleArray.splice(startParentRuleIndex, parentRuleLength, parenRuleNode);
					ruleIndex = startParentRuleIndex;
					parentRuleLength = 0;
					consecPoss.clear();
					poss.clear();
				}
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

class ParseException extends Error {

	constructor(...args){
		super(...args);
	}
}
