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
require('./lib/cli')