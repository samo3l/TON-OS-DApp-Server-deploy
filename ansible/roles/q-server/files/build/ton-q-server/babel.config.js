const presets = [
	["@babel/preset-flow"],
];
const plugins = [
	["@babel/plugin-proposal-export-default-from"],
	["@babel/plugin-proposal-export-namespace-from"],
	["@babel/plugin-proposal-nullish-coalescing-operator"],
	["@babel/plugin-proposal-numeric-separator"],
	["@babel/plugin-proposal-optional-chaining"],
	["@babel/plugin-syntax-bigint"],
	["@babel/plugin-syntax-dynamic-import"],
	["@babel/plugin-transform-modules-commonjs"],
];

module.exports = {presets, plugins};
