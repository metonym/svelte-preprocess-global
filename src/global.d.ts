import type { Element } from "svelte/types/compiler/interfaces";
import type { PreprocessorGroup } from "svelte/types/compiler/preprocess";

declare global {
  interface SveltePreprocessor<PreprocessorType, Options = any> {
    (options?: Options): Pick<PreprocessorGroup, PreprocessorType>;
  }

  interface BaseNode {
    type: string;
    name: string;
    start: number;
    end: number;
  }

  interface DeclarationNode extends BaseNode {
    type: "Declaration";
    property: string;
    value: {
      children: IdentifierNode[];
    };
  }

  interface AtruleNode extends BaseNode {
    type: "Atrule";
    prelude: BaseNode & {
      children: IdentifierNode[];
    };
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

  interface IdentifierNode extends BaseNode {
    type: "Identifier";
    name: string;
  }

  interface AttributeSelectorNode extends Omit<BaseNode, "name"> {
    type: "AttributeSelector";
    name: IdentifierNode;
  }

  type AstNode =
    | Element
    | AttributeSelectorNode
    | ClassSelectorNode
    | SelectorNode
    | IdSelectorNode
    | DeclarationNode
    | AtruleNode;
}
