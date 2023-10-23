import { Token, RuleSet, Operation, OperationType } from "../types.js"

class Tokenizer {
	private readonly _tokens: Token[] = [] // Will contain all the tokens generated from source
	private readonly _rules: RuleSet = {
		// block tags
		block_opening_tag: /<!--/,
		block_closing_tag: /-->/,
		block_self_closing_tag: /--\/>/,

		// shortcode tags
		shortcode_opening_tag: /\[/,
		shortcode_closing_tag: /\]/,
		shortcode_self_closing_tag: /\/\]/,
	}

	private _cursor: number = 0 // Will point to the current position in source
	private _line: number = 1 // Will point to the current line in source
	private _column: number = 0 // Will point to the current column in line

	private _history: Operation[] = [] // For the purpose on undoing and redoing operations

	constructor(private readonly source: string, ignore: string[] = []) {
		// remove from rules all the keys that are in ignore list
		Object.keys(this._rules).forEach(key => {
			if (ignore.includes(key)) {
				delete this._rules[key]
			}
		})

		// create tokens from source based on rules
		this.generateTokens()

		// create a proxy object to intercept property (_tokens, _rules, _cursor, _line, _column) modifications
		// and create an operation object based on each modification
		const self = this
		const handler = {
			set(target: any, property: string, value: any): boolean {
				const properties = [
					"_tokens",
					"_rules",
					"_cursor",
					"_line",
					"_column",
				]

				if (properties.includes(property)) {
					// create an operation object
					const operation: Operation = {
						type: OperationType.UPDATE,
						name: property,
						newValue: value,
						oldValue: target[property],
						expiresAt: Date.now() + 1000 * 60 * 60 * 24,
					}
					// log the operation
					self.logOperation(operation)
				}

				// set the property value
				target[property] = value

				// indicate success
				return true
			},
		}
		// create the proxy object with the handler
		const proxy = new Proxy(this, handler)
	}

	get tokens(): Token[] {
		return this._tokens
	}

	get rules(): RuleSet {
		return this._rules
	}

	get history(): Operation[] {
		return this._history
	}

    /**
     * Logs an operation to the history
     * @param operation the operation to log
     * @returns void
     */
    private logOperation(operation: Operation): void {
        console.table(operation)

        // remove all the expired operations
        this._history = this._history.filter(op => op.expiresAt > Date.now())

        // add the operation to the history
        this._history.push(operation)
    }

	/**
	 * Generates tokens from the source based on the rules in the ruleset
	 *
	 * @param apply_rules whether to apply the rules in the ruleset on the words or not
	 *
	 * @returns void
	 */
	private generateTokens(): void {
		// extract all the lines from the source
		const lines = this.extractLines(this.source)

		// for each line, extract all the words
		const wordsCloud = lines.map(line => this.extractWords(line))

		// for each word, check if it matches any of the rules in the ruleset
		// update the cursor position, the line number, and the column number as you go
		wordsCloud.forEach((words, line_number) => {
			// apply the rules in the ruleset on the words
			const tokens = this.applyRules(words, line_number)

			// add the tokens to the tokens array
			this._tokens.push(...tokens)
		})
	}

	/**
	 * Extracts all the lines from a string
	 *
	 * @param source the string to extract lines from
	 *
	 * @returns the extracted lines in an array
	 */
	private extractLines(source: string): string[] {
		// use regex to extract all the lines from the source
		const lines = source.match(/.*(\r\n|\n)/gm)

		// if lines is null, return an empty array
		if (lines === null) {
			return []
		}

		// only return the lines that are not empty
		return lines.filter(line => line.trim().length > 0)
	}

	/**
	 * Extracts all the words from a string
	 *
	 * @param text the string to extract words from
	 * @param include_whitespace whether to include whitespace in the returned array or not
	 *
	 * @returns the extracted words in an array
	 */
	private extractWords(text: string, include_whitespace = false): string[] {
		// use regex to extract all the words from the text
		const words = text.match(/(\S+|\s+)/g)

		// if words is null, return an empty array
		if (words === null) {
			return []
		}

		if (include_whitespace) {
			return words
		}

		return words.filter(word => word.trim().length > 0)
	}

	/**
	 * Returns a list of words that are generated from the source
	 *
	 * @param words the words generated from the source. Each word is a string.
	 * @param line_no the line number of the source
	 * @returns the generated words
	 */
	private *applyRules(words: string[], line_no: number): Generator<Token> {
		// for each word, apply the rules in the ruleset to the word
		// if the word matches a rule, yield a token
		// update the cursor position, the line number, and the column number whether it matches a rule or not
		for (const word of words) {
			// apply the rules on the word
			const token = this.applyRulesOnWord(word)

			// update the cursor position, the line number, and the column number
			this.updatePosition(token, line_no)

			// yield the token
			yield token
		}

		// return the tokens array
		return this.tokens
	}

	/**
	 *  Applies the rules in the ruleset on a word
	 *
	 * @description For each rule in the ruleset, check if the word matches the rule.
	 * If it matches, return a token with the type of the rule and the word as value
	 * else, return a token with type "unknown" and the word as value
	 *
	 * @param word The word to apply the rules on
	 * @param line_no The current line number of the source
	 *
	 * @returns
	 */
	private applyRulesOnWord(word: string): Token {
		for (const rule in this.rules) {
			// check if the word matches the rule
			if (this.rules[rule].test(word)) {
				// return a token with the type of the rule and the word as value
				return {
					type: rule,
					value: word,
					start: this._cursor,
					end: this._cursor + word.length,
				}
			}
		}

		// return a token with type "unknown" and the word as value
		return {
			type: "unknown",
			value: word,
			start: this._cursor,
			end: this._cursor + word.length,
		}
	}

	/**
	 * Updates the cursor position, the line number, and the column number
	 * of the source based on the token
	 *
	 * @param token The token to use to update the cursor position, the line number, and the column number
	 * @param line_no The current line number of the source
	 *
	 * @returns void
	 */
	private updatePosition(token: Token, line_no: number): void {
		// update the cursor position
		this._cursor += token.value.length

		// reset column number if line number is changed, else update it
		this._column =
			this._line !== line_no ? 0 : this._column + token.value.length

		// update the line number
		this._line = line_no
	}
}

export default Tokenizer
