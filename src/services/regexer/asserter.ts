import { IRegexerExpect } from "@/interfaces/regexer";
import RegexerExpect from "./expect";

/**
 * @summary A Regular Expression Unit Tester Assertion
 * @description
 * It is used to make assertions on the regular expression test case.
 * It is similar to the `expect` function in the jest library.
 * It contains the test case which will be the context for the assertions.
 *
 * @class
 */
export class RegexerAsserter {
  private readonly _expect: IRegexerExpect;
  /**
   * Initialize the RegexerAssertion class
   * @param {RegExp} regex The regular expression to test against
   * @returns void
   */
  constructor(regex: RegExp) {
    this._expect = new RegexerExpect(regex);
  }

  /**
   * @name expect
   * Make assertions on the test case
   * @returns {IRegexerExpect} The expectation object
   */
  expect(input: string): IRegexerExpect {
    this._expect.input = input;
    return this._expect;
  }
}
