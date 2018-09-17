const babylon = require("babylon");
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const t = require('babel-types');

const code =`const a = "babel";`;

const AST = babylon.parse(code);

const visitor = {
	Program(path) {
			const { node } = path;

		for (const directive of node.directives ) {
				if (directive.value.value === "use strict"){
					return;
				}
		}

		path.unshiftContainer(
				"directives",
				t.directive(t.directiveLiteral("use strict")),
		);
	},
	VariableDeclaration(path) {
		const { node } = path;
		if(node.kind === "const"){
				node.kind = "var";
		}
	}
}

traverse(AST, visitor);

const result = generate(AST).code;

const test =`"use strict";

var a = "babel";`

console.log(result === test) // true