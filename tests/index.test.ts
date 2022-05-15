import { expect, test } from "vitest";
import * as API from "../src";
import type { Processed } from "svelte/types/compiler/preprocess";

test("API", () => {
  expect(Object.keys(API)).toMatchInlineSnapshot(`
    [
      "global",
    ]
  `);
});

const preprocess = (content: string) => (API.global().markup({ content }) as Processed).code;

test("no styles", () => {
  expect(preprocess(`<Component id="my-id" class="class1 class2" />`)).toMatchSnapshot();
});

test("single id, class", () => {
  expect(
    preprocess(`<Component id="my-id" class="class1 class2" />

<style>
  #my-id { outline: 1px solid blue; }

  .class1 { color: red; }
</style>`)
  ).toMatchSnapshot();
});

test("styles first, multiple selectors", () => {
  expect(
    preprocess(`<style>
  .class1, .class2 { color: red; }

  .class2 { outline: 1px solid red; }

  .class2 div, #h1, .not-a-class { color: blue; }

  #my-id > div, #h1, .not-a-class { color: blue; }
</style>

<Component id="my-id" class="class1 class2" />`)
  ).toMatchSnapshot();
});

test("single id, class", () => {
  expect(
    preprocess(`<Component id="my-id" class="class1 class2" />

<style>
  #my-id { outline: 1px solid blue; }

  .class1 { color: red; }
</style>`)
  ).toMatchSnapshot();
});

test("data attributes", () => {
  expect(
    preprocess(`<style>
  [data-attr] { color: red; }

  [data-attr2] div, data-value { color: blue; }
</style>

<Component data-attr data-attr2="value" />`)
  ).toMatchSnapshot();
});

test("readme example", () => {
  expect(
    preprocess(`<Component id="component" data-component class="bg-blue" />

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
</style>`)
  ).toMatchSnapshot();
});
