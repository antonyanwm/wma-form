import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

import { readFileSync } from 'fs';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('-w');

const config = [
	{
		input: 'index.ts',
		output: [
			{
				file: packageJson.main,
				format: 'cjs',
				sourcemap: true,
			},
			{
				file: packageJson.module,
				format: 'esm',
				sourcemap: true,
			},
		],
		plugins: [
			peerDepsExternal(),
			resolve({
				browser: true,
			}),
			commonjs(),
			postcss({
				extract: true,
				minimize: !isDev,
				modules: false,
				use: {
					sass: null,
					stylus: null,
					less: null,
				},
			}),
			copy({
				targets: [
					{ src: 'styles/design-system.css', dest: 'dist' },
					{ src: 'styles/base.css', dest: 'dist' },
				],
			}),
			typescript({
				tsconfig: './tsconfig.json',
				exclude: ['**/*.test.*', '**/*.spec.*'],
				declaration: !isDev,
				declarationMap: !isDev,
			}),
		],
		external: ['react', 'react-dom'],
	},
];

// Добавляем DTS plugin только для production build
if (!isDev) {
	config.push({
		input: 'index.ts',
		output: [{ file: 'dist/index.d.ts', format: 'esm' }],
		plugins: [dts()],
		external: [/\.css$/],
	});
}

export default config;
