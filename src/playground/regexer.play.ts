import { Regexer } from "@/services/regexer";

const regexer = new Regexer();

// Test suite
regexer.suite("Test Suite", (suite) => {
  // Calling setup is essential to initialize the built-in asserter
  suite.setup(/Hello/, { global: true });

  // Test case 1
  regexer.case("Test Case 1", () => {
    suite.expect("Hello World").toMatch();
  });

  // Test case 2
  regexer.case("Test Case 2", () => {
    suite.expect("Fellow World").toNotMatch();
  });
});

// Run the test suite
regexer.run();
