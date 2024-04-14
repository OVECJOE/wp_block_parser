import { IRegexerExpect } from "@/interfaces/regexer";

/**
 * @summary A Regular Expression Unit Tester Expectation
 * @description
 * It is used to make assertions on the regular expression test case.
 * It is similar to the `expect` function in the jest library.
 *
 * @implements {IRegexerExpect}
 * @class
 */
class RegexerExpect implements IRegexerExpect {
  public input?: string;

  /**
   * Initialize the RegexerExpect class
   * @param {RegExp} _regex The regular expression to test against
   * @returns {void}
   */
  constructor(private readonly _regex: RegExp) {}

  /**
   * @name toMatch
   * Assert that the input matches the regular expression
   * @returns {void}
   */
  toMatch(): void {
    if (!this.input) {
      throw new Error("No input has been provided");
    }

    if (!this._regex.test(this.input)) {
      throw new Error(`Expected ${this.input} to match ${this._regex}`);
    }
  }

  /**
   * @name toNotMatch
   * Assert that the input does not match the regular expression
   * @returns {void}
   */
  toNotMatch(): void {
    if (!this.input) {
      throw new Error("No input has been provided");
    }

    if (this._regex.test(this.input)) {
      throw new Error(`Expected ${this.input} to not match ${this._regex}`);
    }
  }
}

export default RegexerExpect;
