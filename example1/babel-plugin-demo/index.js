module.exports = function({ types: t }) {
  return {
    visitor: {
      Program(path, ref) {
				const { node } = path;
				const opts = ref.opts;
				const openStrict = opts.openStrict || false;
			
				if(!openStrict) return;

				for (const directive of node.directives ) {
					if (directive.value.value === "use strict") return;
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
  };
}