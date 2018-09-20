const babel = require('babel-core');

const code =`const a = "babel";`;

const result = babel.transform(code, {
    babelrc: false,    plugins: [
       // ["demo", { "openStrict":false }]
       ["./babel-plugin-demo", { "openStrict": true }]
    ]
})

const test =`"use strict";

var a = "babel";`

console.log(result.code === test) //true