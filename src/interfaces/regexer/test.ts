interface IRegexerSuiteTestCase {
  description: string;
  fn: () => void;
  run(): void;
  setup(fn: () => void): void;
}

export default IRegexerSuiteTestCase;
