import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// import { terser } from "rollup-plugin-terser";

export default {
    input: './src/app.ts',
    output: {
        file: './dist.js',
        format: 'cjs'
    },
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        // terser({
        //     // remove all comments
        //     format: {
        //         comments: false
        //     },
        //     compress: false
        // }),
    ]
};