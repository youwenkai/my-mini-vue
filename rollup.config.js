import ts from "@rollup/plugin-typescript";

module.exports = {
  input: "./src/index.ts",
  output: [
    {
      format: "cjs",
      file: "lib/runtime-core.cjs.js",
    },
    {
      format: "esm",
      file: "lib/runtime-core.esm.js",
    },
  ],
  plugins: [ts()],
};
