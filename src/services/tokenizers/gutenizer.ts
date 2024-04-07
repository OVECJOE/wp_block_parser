import { RuleType, RuleSet } from "@/types";
import { ITokenizer, IToken, Operator } from "@/interfaces";
import { History } from "./lib";

/**
 * @summary A Gutenberg-Based Tokenizer
 * @description It is used to tokenize a source string (or content) that was written using Gutenberg's block editor.
 *
 * @implements ITokenizer
 * @class
 */
class Gutenizer implements ITokenizer {
  private _tokens: IToken[] = [];
  private _cursor: number = 0;
  private _line: number = 0;
  private _column: number = 0;
  private readonly _history: History<IToken>;
  // TODO: Fix rules; they are not working as expected
  private readonly _rules: RuleSet = {
    BLOCK_SELF_CLOSING_TAG: /<!--\s*wp:([^/]+)({.*})?\s*\/-->/,
    BLOCK_OPENING_TAG: /<!--\s*wp:([^>\s]*)\s*([^>]*)?\s*-->/,
    BLOCK_CLOSING_TAG: /<!--\s*\/wp:([^/]+)\s*-->/,
  };

  /**
   * Create a new Gutenberg-Based Tokenizer
   * @param source The source string (or content) to tokenize
   * @param ignoredRules The rules to ignore when tokenizing the source
   *
   * @returns void
   */
  constructor(
    private readonly _source: string,
    ignoredRules: string[] = [],
  ) {
    const rules = { ...this._rules };
    for (const rule of ignoredRules) {
      if (Object.prototype.hasOwnProperty.call(rules, rule)) {
        delete rules[rule as RuleType];
      }
    }
    this._rules = rules;

    // Initialize the history
    this._history = new History(true, 50);
  }

  /**
   * Get the tokens generated from the source
   * @returns the tokens
   */
  get tokens(): IToken[] {
    return this._tokens;
  }

  /**
   * Get the history of operations
   * @returns the history
   */
  get history(): History<IToken> {
    return this._history;
  }

  /**
   * Get the ruleset used for tokenizing the source
   * @returns the ruleset
   */
  get rules(): RuleSet {
    return this._rules;
  }

  /**
   * Get the current position of the tokenizer in the source
   * @returns the cursor position
   */
  get cursor(): number {
    return this._cursor;
  }

  /**
   * Get the current line number of the source
   * @returns the line number
   */
  get line_no(): number {
    return this._line;
  }

  /**
   * Get the current column number of the source
   * @returns the column number
   */
  get col_no(): number {
    return this._column;
  }

  /**
   * Reset the tokenizer to the initial state
   * @returns void
   */
  reset(): void {
    this._tokens = [];
    this._cursor = 0;
    this._line = 0;
    this._column = 0;
    this._history.clear();
  }

  /**
   * Tokenizes a source string (or content) using the ruleset
   * @returns An array of tokens
   */
  tokenize(): IToken[] {
    // Reset the tokenizer
    this.reset();

    // Split the source into lines
    const lines = this._source.split(/\r?\n/);

    // For each line, extract the tokens
    lines.forEach((line, line_no) => {
      this._line = line_no;

      // Extract the tokens from the line
      const tokens = this._extract(line);
      this._tokens.push(...tokens);

      // Update the cursor position
      this._cursor += line.length + 1;
    });

    return this._tokens;
  }

  /**
   * Extracts tokens from a line of the source
   * @param line The line to extract tokens from
   * @returns An array of tokens
   *
   * @todo Handle the case where there is an IDENTIFIABLE or a LITERAL token
   * before the first BLOCK_* token in the line
   */
  private _extract(line: string): IToken[] {
    const tokens: IToken[] = [];

    // reset the column position
    this._column = 0;

    // Find the next token
    while (this._column < line.length) {
      const token = this._findToken(line, this._column);
      if (!token) {
        break;
      }

      // Update the cursor position
      this._column = token.end;

      // Add the token to the list
      tokens.push(token);
    }

    return tokens;
  }

  /**
   * Check if text has a token that matches any rule element in the ruleset.
   * @param text The text to check for a token
   * @returns true if the text has a token, false otherwise
   */
  private _hasToken(text: string): boolean {
    for (const key in this._rules) {
      const rule = this._rules[key as RuleType] as RegExp;
      if (text.match(rule)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Find the next token in a line
   * @param line The line to find the token in
   * @param cursor The current position in the line
   * @returns The next token
   */
  private _findToken(line: string, cursor: number): IToken {
    let token: IToken | null = null;

    for (const key in this._rules) {
      // Get the rule for the token
      const rule = this._rules[key as RuleType] as RegExp;

      // Find the next match
      const match = line.slice(cursor).match(rule);
      if (match) {
        // Tokenize the match
        const start = this._cursor + cursor + (match.index || 0);
        token = {
          type: key as RuleType,
          name: match[1],
          text: match[0],
          start,
          end: start + match[0].length,
        };

        if (match.length > 2) {
          token.attrs = match[2]?.trim();
        }

        break;
      }
    }

    if (!token) {
      // Check if line is an IDENTIFIABLE token or a LITERAL token
      const opened = this._tokens.filter(
        (t) => t.type === RuleType.BLOCK_OPENING_TAG,
      );

      // check which of the opened blocks is not closed based on start and end values
      const unclosed = opened.filter(
        (t) =>
          !this._tokens.some(
            (t2) =>
              t2.type === RuleType.BLOCK_CLOSING_TAG &&
              t.name === t2.name &&
              t2.start > t.start,
          ),
      );

      // Create the token
      token = {
        type: unclosed.length > 0 ? "IDENTIFIABLE" : "LITERAL",
        text: line.slice(cursor),
        start: this._cursor + cursor,
        end: this._cursor + line.length,
      };
    }

    // Update the history
    this._history.push({
      opcode: Operator.CREATE,
      data: token,
      timestamp: Date.now(),
      origin: Symbol.for(this.constructor.name),
    });

    return token;
  }
}

export default Gutenizer;
