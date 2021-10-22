# `parcel-transformer-lezer`

A Parcel transformer for [@lezer/generator](https://github.com/lezer-parser/generator).

## Usage:

Install this package and some Lezer packages that will be imported by the generated code

```sh
yarn add -D @parcel/config-default parcel-transformer-lezer
yarn add @lezer/common @lezer/lr
```

Add a `.parcelrc` with

```json
{
	"extends": "@parcel/config-default",
	"transformers": {
		"*.grammar": ["parcel-transformer-lezer"]
	}
}
```

Then import it from Javascript.

```js
import { parser } from "./foo.grammar";

let tree = parser.parse("...");
```

`parser` is an instance of [`LRParser`](https://lezer.codemirror.net/docs/ref/#lr.LRParser). Apart from this method, there is also an export for each grammar term mapping to its id.

See the `example` folder for a complete example.
