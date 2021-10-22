const { Transformer } = require("@parcel/plugin");

const lezer = require("@lezer/generator");

module.exports = new Transformer({
	async transform({ asset, logger }) {
		const { parser, terms } = lezer.buildParserFile(await asset.getCode(), {
			moduleStyle: "es",
			warn: (message) => logger.warn(message),
		});

		asset.type = "js";
		asset.setCode(`
			export {parser} from "parser";
			export * from "terms";
		`);
		asset.addDependency({
			specifier: "parser",
			specifierType: "esm",
		});
		asset.addDependency({
			specifier: "terms",
			specifierType: "esm",
		});
		return [
			asset,
			{
				type: "js",
				uniqueKey: "parser",
				content: parser,
			},
			{
				type: "js",
				uniqueKey: "terms",
				content: terms,
			},
		];
	},
});
