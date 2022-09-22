import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
	input: "src/index.ts",
	output: [
		{
			file: "dist/bundle.js",
			format: "es",
			name: "acryl-bias-hichart",
			sourcemap: true,
		},
		// {
		// 	file: "dist/common.js",
		// 	format: "cjs",
		// 	name: "acryl-bias-hichart",
		// 	sourcemap: true,
		// }
	],
	plugins: [
		babel({
			babelHelpers: "bundled",
			presets: [
				"@babel/preset-env",
				"@babel/preset-react",
				"@babel/preset-typescript",
			],
			exclude: ["node_modules/**"],
			extensions: [".js", ".jsx", ".ts", ".tsx"],
		}),
		resolve({
			extensions: [".js", ".jsx", ".ts", ".tsx"]
		}),
		typescript(),
		terser()
	],
	external: ['react', 'react-dom', 'styled-components', 'highcharts', 'highcharts/highcharts-3d', 'highcharts/highcharts-more']
}