import { parser } from "./json.grammar";

let strictParser = parser.configure({ strict: false });

let input = ` ( a + ( b - 1 ) ) `;
let tree = strictParser.parse(input);

let cursor = tree.cursor();
console.log(input);
do {
	console.log(`Node ${cursor.name} from ${cursor.from} to ${cursor.to}`);
	console.log(
		" ".repeat(cursor.from) +
			"_".repeat(cursor.to - cursor.from) +
			" ".repeat(input.length - cursor.to) +
			" " +
			cursor.name
	);
} while (cursor.next());
console.log(input);
