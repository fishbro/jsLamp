import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
    input: './src/app.ts',
    output: {
        file: './dist.js',
        format: 'cjs'
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript(),
    ],
    external: []
};
