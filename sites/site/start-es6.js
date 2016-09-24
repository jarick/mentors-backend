require("babel-register")({
  presets: ["es2015-node6", "stage-0"],
  plugins: [
    "transform-async-to-generator",
    "syntax-async-functions",
    "typecheck",
    "syntax-flow",
    "transform-flow-strip-types"
  ],
});
const Start = require('./lib/start');
Start.migrate().then(
  () => console.log(true), (e) => console.log(e)
)
