import { parse, walk } from "svelte/compiler";
import MagicString from "magic-string";
import type { PreprocessorGroup } from "svelte/types/compiler/preprocess";
import type { Element } from "svelte/types/compiler/interfaces";

interface BaseNode {
  type: string;
  name: string;
  start: number;
  end: number;
}

interface ClassSelectorNode extends BaseNode {
  type: "ClassSelector";
  children: any[];
}

interface IdSelectorNode extends BaseNode {
  type: "IdSelector";
}

interface SelectorNode extends BaseNode {
  type: "Selector";
  children: ClassSelectorNode[];
}

interface AttributeSelectorNode extends Omit<BaseNode, "name"> {
  type: "AttributeSelector";
  name: {
    type: "Identifier";
    name: string;
  };
}

type Node = Element | AttributeSelectorNode | ClassSelectorNode | SelectorNode | IdSelectorNode;

type StyleKey = ClassSelectorNode["type"] | IdSelectorNode["type"] | AttributeSelectorNode["type"];

const PREFIX: Record<StyleKey, (selector: string) => string> = {
  ClassSelector: (selector) => "." + selector,
  IdSelector: (selector) => "#" + selector,
  AttributeSelector: (selector) => "[" + selector + "]",
};

const useGlobal = (selector: string) => ":global(" + selector + ")";

export function global(): Pick<PreprocessorGroup, "markup"> {
  return {
    markup({ content, filename }) {
      if (filename && /(node_modules|.svelte-kit)/.test(filename)) return;

      const s = new MagicString(content);
      const ids = new Set();
      const class_names = new Set();
      const data_attributes = new Set();

      const apply_global = ({
        node,
        parent,
        selector,
      }: {
        node: IdSelectorNode | ClassSelectorNode | AttributeSelectorNode;
        parent: Node;
        selector: string;
      }) => {
        let start = node.start;
        let end = node.end;
        let value = useGlobal(PREFIX[node.type](selector));

        if ((parent as SelectorNode).children.length > 1) {
          start = parent.start;
          end = parent.end;
          value = useGlobal(content.slice(start, end));
        }

        s.overwrite(start, end, value);
      };

      walk(parse(content), {
        enter(node: Node, parent: Node) {
          if (node.type === "InlineComponent") {
            node.attributes.forEach(({ name, value }) => {
              const raw: string = value[0]?.raw;

              if (name === "id") {
                ids.add(raw);
              } else if (name === "class") {
                raw.split(" ").forEach(class_names.add.bind(class_names));
              } else if (/^data-/.test(name)) {
                data_attributes.add(name);
              }
            });
          }

          if (node.type === "ClassSelector" && class_names.has(node.name)) {
            apply_global({ node, parent, selector: node.name });
          }

          if (node.type === "IdSelector" && ids.has(node.name)) {
            apply_global({ node, parent, selector: node.name });
          }

          if (node.type === "AttributeSelector" && data_attributes.has(node.name.name)) {
            apply_global({ node, parent, selector: node.name.name });
          }
        },
      });

      return {
        code: s.toString(),
        map: s.generateMap({ file: filename, includeContent: true }),
      };
    },
  };
}
