import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    input: './src/main.ts',
    output: [
        {
            file: 'dist/index.cjs',
            sourcemap: true,
            format: 'cjs'
        },
        {
            file: 'dist/index.js',
            sourcemap: true,
            format: 'es'
        }
    ],
    external: ["regex-parser"],
    plugins: [nodeResolve(), typescript()]
};