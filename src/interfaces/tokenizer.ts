import { RuleSet } from "@/types";
import IHistory from "./history";
import IToken from "./token";

interface ITokenizer {
  // Properties
  /** The tokens generated from the source */
  readonly tokens: IToken[];
  /** The history of operations */
  readonly history: IHistory<IToken>;
  /** The ruleset used for tokenizing the source */
  readonly rules: RuleSet;
  /** The current position of the tokenizer in the source */
  readonly cursor: number;
  /** The current line number of the source */
  readonly line_no: number;
  /** The current column number in the current line of the source */
  readonly col_no: number;

  // Methods
  tokenize(): Generator<IToken[]>;
  reset(): void;
}

export default ITokenizer;
