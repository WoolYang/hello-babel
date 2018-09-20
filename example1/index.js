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
		path.node.body.unshift(
			t.variableDeclaration(
				'const',
				[t.variableDeclarator(
					t.identifier("bebel"),
					t.callExpression(
						t.identifier("require"),
						[t.stringLiteral("bebel-core")]
					)
				)]
			)
		)
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
const babel = require("babel-core");
var a = "babel";`

console.log(result === test) // true