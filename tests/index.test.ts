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

const preprocess = (content: string) => (API.global().markup?.({ content }) as Processed).code;

test("no styles", () => {
  expect(preprocess(`<Component id="my-id" class="class1 class2" />`)).toMatchSnapshot();
});

test("single id, class", () => {
  expect(
    preprocess(`<Component id="my-id" class="class1 class2" />

<h1>Hello world</h1>

<style>
  #my-id { outline: 1px solid blue; }

  .class1 { color: red; }

  h1 { font-size: 2rem; }
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

test("keyframes", () => {
  expect(
    preprocess(`<Component class="animate animate-name transition transition-name" />

<style>
  .animate {
    animation: fade 1.5s linear infinite;
  }

  .animate-name {
    animation-name: fade-out;
  }

  @keyframes fade {
    50% {
      opacity: 0;
    }
  }

  @-webkit-keyframes fade {
    50% {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    50% {
      opacity: 0;
    }
  }
</style>`)
  ).toMatchSnapshot();
});
