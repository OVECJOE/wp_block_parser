import IRegexerSuiteTestCase from "./test";
import IRegexerFlags from "./flags";
import IRegexerExpect from "./expect";

type SharedContext = Record<string, unknown>;

interface IRegexer {
  describe(description: string, fn: () => void): void;
  it(description: string, fn: () => void): void;
  run(): void;
}

export {
  IRegexer,
  IRegexerSuiteTestCase,
  IRegexerFlags,
  IRegexerExpect,
  SharedContext,
};
