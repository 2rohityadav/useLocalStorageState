
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import analyze from 'rollup-plugin-analyzer';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

// const pkg = require("./package.json");
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    input: './src/index.ts',
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true },
      { file: pkg.module, format: "esm", sourcemap: true },
    ],
    plugins: [
      resolve(),
      commonjs(),
      analyze({ summaryOnly: true, hideDeps: true }),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
  },
  {
    input: "dist/esm/types/src/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];