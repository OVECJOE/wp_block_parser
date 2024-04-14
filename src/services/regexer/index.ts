import { injectable } from "inversify";
import { RegexerSuite } from "./suite";
import { RegexerSuiteTestCase } from "./test";
import { SharedContext } from "@/interfaces/regexer";

/**
 * @summary A Regular Expression Unit Tester
 * @description
 * It is used to test how a regular behavior behaves with a given input.
 * It is useful for debugging and testing regular expressions.
 * It works similarly to the jest library and here are the main functions:
 * - `suite` is used to group a set of tests that are related to a specific regular expression. Similar to the `describe` function in the jest library.
 * - `case` is used to create a new test case. Similar to the `it` function in the jest library.
 * - `setup` is used to perform tasks that a test suite depends on. Similar to the `beforeAll` function in the jest library.
 * - `teardown` is used to perform tasks after a test suite is run. Similar to the `afterAll` function in the jest library.
 * - `run` is used to run all the test suites and test cases. Similar to the `run` function in the jest library.
 *
 * @example
 * ```typescript
 * const regexer = new Regexer();
 * regexer.suite("Test Suite", (suite) => {
 *  suite.setup(/Hello/, { global: true });
 *
 *  // Test case 1
 *  regexer.case("Test Case 1", () => {
 *    suite.expect("Hello World").toMatch();
 *  });
 *
 *  // Test case 2
 *  regexer.case("Test Case 2", () => {
 *    suite.expect("Fellow World").toNotMatch();
 *  });
 * });
 * ```
 *
 * @class
 */
@injectable()
export class Regexer {
  private _suites: RegexerSuite[] = [];
  private _currentSuite: RegexerSuite | null = null;
  private _currentTest: RegexerSuiteTestCase | null = null;

  /**
   * @name suite
   * Describe a suite of tests
   * @param description The description of the suite
   * @param fn The function that contains the tests
   * @returns void
   */
  suite(description: string, fn: (suite: RegexerSuite) => void): void {
    if (this._currentSuite !== null) {
      throw new Error("Cannot create a suite inside another suite");
    }

    // Create a new suite and push it to the suites array
    this._suites.push(new RegexerSuite(description));

    // Set the current suite to the last suite in the suites array
    this._currentSuite = this._suites[this._suites.length - 1];

    // Run the function that contains the test cases
    fn(this._currentSuite);

    // Reset the current suite and test
    this._currentSuite = null;
    this._currentTest = null;
  }

  /**
   * @name case
   * Create a new test
   * @param description The description of the test
   * @param fn The function that contains the assertions
   * @returns void
   */
  case(description: string, fn: () => void): void {
    if (this._currentSuite === null) {
      throw new Error("Cannot create a test outside of a suite");
    }

    // ensure that there is a regex setup in the current suite
    if (!this._currentSuite.regex) {
      throw new Error(
        "A regular expression must be set up before running a test",
      );
    }

    // Create a new test and push it to the current suite
    this._currentSuite.push(new RegexerSuiteTestCase(description, fn));
    this._currentTest = this._currentSuite[this._currentSuite.length - 1];
  }

  /**
   * @name setup
   * @summary Takes a function to be run before a suite is run
   * @description
   * It can be used to perform tasks that a test suite depends on.
   *
   * @example:
   * - it can be used to set up the regular expression and flags for the suite.
   * - it can be used to set up one input that will be used in all the test cases.
   * - it can be used to set up some data that will be used in all the test cases.
   * - it can be used to set up some configuration that will be used in all the test cases.
   *
   * @param fn The function to run before the suite
   * @returns void
   */
  setup(fn: (context: SharedContext) => void): void {
    if (this._currentSuite === null) {
      throw new Error("Cannot set up outside of a suite");
    }

    // Run the setup function and make whatever variables it creates globally available to the suite
    fn(this._currentSuite.shared);
  }

  /**
   * @name teardown
   * @summary Takes a function to be run after a suite is run
   *
   * @param fn The function to run after the suite
   * @returns void
   */
  teardown(fn: () => void): void {
    if (this._currentSuite === null) {
      throw new Error("Cannot tear down outside of a suite");
    }

    // Run the teardown function and clear the shared context
    fn();
    this._currentSuite.shared = null;
  }

  /**
   * @name run
   * @summary Run all the test suites and test cases
   * @log The results of the test suites and test cases
   * @returns void
   */
  run(): void {
    console.group("🧪 Regexer Test Runner");
    // Run the test suites
    this._suites.forEach((suite) => {
      console.group(`🧪 ${suite.description}`);
      // Run the test cases and log the results
      for (const testCase of suite) {
        try {
          testCase.run();
          console.log(`✅ ${testCase.description}`);
        } catch (error) {
          console.error(
            `❌ ${testCase.description}\n${(error as Error).message}`,
          );
        }
      }
      console.groupEnd();
    });
    console.groupEnd();
  }
}
