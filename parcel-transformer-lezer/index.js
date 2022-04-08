const { Transformer } = require("@parcel/plugin");
const { default: ThrowableDiagnostic } = require("@parcel/diagnostic");

const lezer = require("@lezer/generator");

module.exports = new Transformer({
	async transform({ asset, logger }) {
		let parser, terms;
		try {
			({ parser, terms } = lezer.buildParserFile(await asset.getCode(), {
				moduleStyle: "es",
				warn: (message) => logger.warn(message),
			}));
		} catch (e) {
			let match = e.message.match(/(.*)\((\d)+:(\d)+\)$/s);
			if (match) {
				let [, msg, line, col] = match;
				let pos = {
					line: Number(line),
					column: Number(col) + 1,
				};
				throw new ThrowableDiagnostic({
					diagnostic: {
						message: msg,
						codeFrames: [
							{
								filePath: asset.filePath,
								codeHighlights: [
									{
										start: pos,
										end: pos,
									},
								],
							},
						],
					},
				});
			} else throw e;
		}

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
