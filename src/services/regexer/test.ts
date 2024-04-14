import { IRegexerSuiteTestCase } from "@/interfaces/regexer";

/**
 * @summary A Regexer Suite Test Case
 * @description
 * It is used to represent a test case in a suite.
 * It is similar to the `it` function in the jest library.
 * It contains a description and a function that contains the assertions.
 * It is used to group a set of assertions that are related to a specific regular expression.
 *
 * @implements IRegexerSuiteTestCase
 * @class
 */
export class RegexerSuiteTestCase implements IRegexerSuiteTestCase {
  readonly description: string;
  readonly fn: () => void;

  constructor(description: string, fn: () => void) {
    this.description = description;
    this.fn = fn;
  }

  /**
   * Run the test case
   * @returns void
   */
  run(): void {
    this.fn();
  }

  /**
   * Setup a function to run before the test case
   * @param fn The function to run before the test case
   * @returns void
   */
  setup(fn: () => void): void {
    fn();
  }
}
