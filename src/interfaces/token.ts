import { RuleType } from "../types/ruleset";

interface IToken {
  type: keyof typeof RuleType | "IDENTIFIABLE" | "LITERAL";
  name?: string;
  attrs?: string;
  text: string;
  start: number;
  end: number;
}

export default IToken;
