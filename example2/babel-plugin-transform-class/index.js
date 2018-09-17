module.exports = function ({ types: t }) {
    return {
        visitor: {
            ClassDeclaration(path) {
                console.log(path.node)
                let node = path.node
                let className = node.id.name
                let classInner = node.body.body
                //创建一个数组用来成盛放新生成AST
                let es5Fns = []
                let newConstructorId = t.identifier(className) //取class名称
                let constructorFn = t.functionDeclaration(newConstructorId, [t.identifier('')], t.blockStatement([]), false, false) //创建同名ast空函数
                console.log(constructorFn)
                for (let i = 0; i < classInner.length; i++) {
                    let item = classInner[i]
                    if (item.kind == 'constructor') {
                        let constructorParams = item.params.length ? item.params[0].name : [] //取出constructor参数
                        let newConstructorParams = t.identifier(constructorParams) //生成参数ast
                        let constructorBody = classInner[i].body //取class内容
                        constructorFn = t.functionDeclaration(newConstructorId, [newConstructorParams], constructorBody, false, false) //生成constructor内容ast
                        console.log(constructorFn)
                    } else {
                        let protoTypeObj = t.memberExpression(t.identifier(className), t.identifier('prototype'), false) //创建prototype
                        let left = t.memberExpression(protoTypeObj, t.identifier(item.key.name), false)
                        let prototypeParams = classInner[i].params.length ? classInner[i].params[i].name : []
                        let newPrototypeParams = t.identifier(prototypeParams)
                        let prototypeBody = classInner[i].body
                        let right = t.functionExpression(null, [newPrototypeParams], prototypeBody, false, false)
                        let protoTypeExpression = t.assignmentExpression("=", left, right)
                        es5Fns.push(protoTypeExpression)
                    }
                }
                es5Fns.push(constructorFn)
                if (es5Fns.length > 1) {
                    path.replaceWithMultiple(es5Fns)
                } else {
                    path.replaceWith(constructorFn)
                }
            }
        }
    };
}