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
