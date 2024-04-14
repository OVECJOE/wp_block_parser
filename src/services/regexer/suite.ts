import {
  IRegexerExpect,
  IRegexerFlags,
  SharedContext,
} from "@/interfaces/regexer";
import { RegexerSuiteTestCase } from "./test";
import { RegexerAsserter } from "./asserter";

const FLAGS_MAPPER = {
  global: "g",
  ignoreCase: "i",
  multiline: "m",
  unicode: "u",
  sticky: "y",
  dotAll: "s",
};

/**
 * @summary A Regexer Suite
 * @description
 * It is used to group a set of tests that are related to a specific regular expression.
 * It is similar to the `describe` function in the jest library.
 * It contains a description and an array of tests.
 *
 * @class
 */
export class RegexerSuite extends Array<RegexerSuiteTestCase> {
  private _regex: RegExp | null = null;
  private _flags: IRegexerFlags | null = null;
  private _shared: SharedContext = {};
  private _asserter: RegexerAsserter | null = null;
  readonly description: string;

  /**
   * Initialize the RegexerSuite class
   * @param description The description of the suite
   */
  constructor(description: string) {
    super();
    this.description = description;
  }

  /**
   * @name regex
   * Get the regular expression for the suite
   * @returns {RegExp} The regular expression
   */
  get regex(): Readonly<RegExp> | null {
    return this._regex;
  }

  /**
   * @name expect
   * Make assertions on the test case
   * @returns {(input: string) => IRegexerExpect} The expectation object
   */
  get expect(): (input: string) => IRegexerExpect {
    if (!this._asserter) {
      throw new Error("No assertion object has been set up for the suite");
    }

    return this._asserter.expect.bind(this._asserter);
  }

  /**
   * @name flags
   * Get the flags for the suite
   * @returns {string} The flags
   */
  get flags(): string | undefined {
    // Convert the flags object to a string
    return Object.keys(this._flags ?? {}).reduce((acc, key) => {
      if (
        this._flags &&
        Object.prototype.hasOwnProperty.call(FLAGS_MAPPER, key)
      ) {
        acc += FLAGS_MAPPER[key as keyof typeof FLAGS_MAPPER];
      }

      return acc;
    }, "");
  }

  /**
   * @name shared
   * Get the shared context for the suite
   * @returns {Record<string, unknown>} The shared context
   */
  get shared(): Readonly<SharedContext> {
    return this._shared;
  }

  /**
   * @name shared
   * Set the shared context for the suite
   * @param {SharedContext | null} context The shared context
   * @returns void
   */
  set shared(context: SharedContext | null) {
    if (!context) {
      this._shared = {};
      return;
    }

    for (const key in context) {
      this._shared[key] = context[key];
    }
  }

  /**
   * @name setup
   * Setup the regular expression and flags for the suite
   * @param {RegExp} regex The regular expression to test
   * @param {IRegexerFlags} flags The flags to use when testing the regular expression
   */
  setup(regex: RegExp, flags: IRegexerFlags): void {
    if (this._regex) {
      throw new Error("A regular expression has already been set up");
    }

    // Set up the regular expression and flags
    this._regex = regex;
    this._flags = flags;

    // Set up the assertion object for the suite
    this._asserter = new RegexerAsserter(regex);
  }
}
