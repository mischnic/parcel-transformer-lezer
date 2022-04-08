const { Transformer } = require("@parcel/plugin");
const { default: ThrowableDiagnostic } = require("@parcel/diagnostic");

const lezer = require("@lezer/generator");

module.exports = new Transformer({
	async transform({ asset, logger }) {
		let parser, terms;
		try {
			({ parser, terms } = lezer.buildParserFile(await asset.getCode(), {
				moduleStyle: "es",
				warn: (message) => {
					let diagnostic = parseError(asset.filePath, message);
					logger.warn(diagnostic || { message });
				},
			}));
		} catch (e) {
			let diagnostic = parseError(asset.filePath, e.message);
			if (diagnostic) {
				throw new ThrowableDiagnostic({
					diagnostic,
				});
			} else {
				throw e;
			}
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

function parseError(filePath, message) {
	let match = message.match(/(.*)\((\d+):(\d+)\)$/s);
	if (match) {
		let [, msg, line, col] = match;
		let pos = {
			line: Number(line),
			column: Number(col) + 1,
		};
		return {
			message: msg,
			codeFrames: [
				{
					filePath: filePath,
					codeHighlights: [
						{
							start: pos,
							end: pos,
						},
					],
				},
			],
		};
	}
}
