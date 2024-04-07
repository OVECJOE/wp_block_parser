import { IHistory, IOperation } from "@/interfaces";

/**
 * @summary A History Model
 * @description It is used to manage the history of operations performed by the tokenizer.
 * @implements IHistory
 * @class
 */
class History<T> implements IHistory<T> {
  private _history: IOperation<T>[];
  private _cursor: number = 0;

  /**
   * Create a new History Model
   * @param cleanStaleOps whether to clean stale operations when limit is reached
   * @param limit the maximum number of operations to store
   */
  constructor(
    readonly cleanStaleOps = false,
    readonly limit: number = 100,
  ) {
    this._history = new Array<IOperation<T>>(limit);
  }

  /**
   * Get the operations in the history
   * @returns the operations
   */
  get operations(): IOperation<T>[] {
    return this._history;
  }

  /**
   * Get the current cursor position
   * @returns the cursor position
   */
  get cursor(): number {
    return this._cursor;
  }

  /**
   * Undo a number of steps
   * @param steps the number of steps to undo
   *
   * @throws {RangeError} if the number of steps is negative or exceeds the limit
   * @returns the current operation after undoing the steps
   */
  undo(steps: number = 1): IOperation<T> {
    if (steps < 0 || steps > this._cursor) {
      throw new RangeError("Invalid number of steps");
    }

    // Move the cursor back
    this._cursor = Math.max(0, this._cursor - steps);
    return this._history[this._cursor];
  }

  /**
   * Redo a number of steps
   * @param steps the number of steps to redo
   *
   * @throws {RangeError} if the number of steps is negative or exceeds the limit
   * @returns the current operation after redoing the steps
   */
  redo(steps: number = 1): IOperation<T> {
    if (steps < 0 || this._cursor + steps > this._history.length) {
      throw new RangeError("Invalid number of steps");
    }

    // Move the cursor forward
    this._cursor = Math.min(this._history.length, this._cursor + steps);
    return this._history[this._cursor];
  }

  /**
   * Pop a number of steps
   * @param steps the number of steps to pop
   *
   * @throws {RangeError} if the number of steps is negative or exceeds the limit
   * @returns the operations that were popped
   */
  pop(steps: number = 1): IOperation<T>[] {
    if (steps < 0 || steps > this._cursor) {
      throw new RangeError("Invalid number of steps");
    }

    // Pop the operations
    const operations = this._history.splice(this._cursor - steps, steps);
    this._cursor -= steps;
    return operations;
  }

  /**
   * Push a new operation to the history
   * @param operation the operation to push
   *
   * @returns true if the operation was pushed, false otherwise
   */
  push(operation: IOperation<T>): boolean {
    if (this._history.length >= this.limit && !this.cleanStaleOps) {
      return false;
    }

    // Remove stale operations
    if (this.cleanStaleOps && this._cursor < this._history.length) {
      this._history.splice(this._cursor, this._history.length - this._cursor);
    }

    // Add the operation to the history
    this._history.push(operation);

    // Move the cursor forward
    this._cursor = this._history.length;
    return true;
  }

  /**
   * Clear the history
   */
  clear(): void {
    this._history = [];
    this._cursor = 0;
  }

  /**
   * Peek at the current operation
   * @returns the current operation
   */
  peek(): IOperation<T> {
    return this._history[this._cursor];
  }

  /**
   * Get the recent operations
   * @param steps the number of recent operations to get
   *
   * @throws {RangeError} if the number of steps is negative or exceeds the limit
   * @returns the recent operations
   */
  recent(steps: number = 1): IOperation<T> | IOperation<T>[] {
    if (steps < 0 || steps > this._cursor) {
      throw new RangeError("Invalid number of steps");
    }

    if (steps === 1) {
      return this._history[this._cursor - 1];
    }

    return this._history.slice(this._cursor - steps, this._cursor);
  }

  /**
   * Get the stale operations
   * @description Stale operations are the operations that were undone
   * @param steps the number of stale operations to get
   *
   * @throws {RangeError} if the number of steps is negative or exceeds the limit
   * @returns the stale operations
   */
  stale(steps: number = 1): IOperation<T>[] {
    if (steps < 0 || steps > this._history.length - this._cursor) {
      throw new RangeError("Invalid number of steps");
    }

    return this._history.slice(this._cursor, this._cursor + steps);
  }

  /**
   * Reverse the operations by a number of steps
   * @description Though the cursor is unaffected, the operations are reversed
   * @param steps the number of operations to reverse
   *
   * @throws {RangeError} if the number of steps is negative or exceeds the limit
   * @returns the reverse operations
   */
  reverse(steps: number): IOperation<T>[] {
    if (steps < 0 || steps > this._history.length) {
      throw new RangeError("Invalid number of steps");
    }

    // Get the operations to reverse and reverse them
    const operations = this._history
      .slice(this._cursor - steps, this._cursor)
      .reverse();

    // update the history
    this._history.splice(this._cursor - steps, steps, ...operations);

    return operations;
  }

  /**
   * Get all the operations
   * @returns all the operations
   */
  all(): IOperation<T>[] {
    return this._history;
  }
}

export default History;
