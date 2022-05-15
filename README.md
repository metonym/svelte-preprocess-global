# svelte-preprocess-global

> Svelte preprocessor that applies the `:global()` directive to id, class, and data attribute selectors passed to Svelte components.

By design, Svelte styles are [component-scoped](https://svelte.dev/docs#component-format-style). The `:global(...)` directive is required to apply a selector globally.

`svelte-preprocess` already supports `<style global>` where every CSS selector is made to apply globally.

Instead of making every selector global, this preprocessor only applies the `:global` directive to ids, classes, and data attributes passed to other Svelte components.

**Input**

```svelte
<Component id="component" data-component class="bg-blue" />

<style>
  #component {
    color: red;
  }

  [data-component] {
    outline: 1px solid white;
  }

  .bg-blue {
    background: blue;
  }
</style>
```

**Output**

```svelte
<Component id="component" class="bg-blue" />

<style>
  :global(#component) {
    color: red;
  }

  :global([data-component]) {
    outline: 1px solid white;
  }

  :global(.bg-blue) {
    color: blue;
  }
</style>
```

## Installation

```bash
# Yarn
yarn add -D svelte-preprocess-global

# NPM
npm i -D svelte-preprocess-global

# pnpm
pnpm i -D svelte-preprocess-global
```

## Usage

Add `global` to the list of preprocessors in your svelte config.

```js
// svelte.config.js
import { global } from "svelte-preprocess-global";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [global()],
};

export default config;
```

## Changelog

[CHANGELOG.md](CHANGELOG.md)

## License

[MIT](LICENSE)
