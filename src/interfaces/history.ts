import { IOperation } from "./operation";

interface IHistory<T> {
  // Properties
  readonly limit: number;
  readonly cleanStaleOps: boolean;
  operations: IOperation<T>[];
  cursor: number;

  // Methods
  undo(steps: number): IOperation<T>;
  redo(steps: number): IOperation<T>;
  pop(steps: number): IOperation<T>[];
  push(operation: IOperation<T>): boolean;
  clear(): void;
  peek(): IOperation<T>;
  recent(steps: number): IOperation<T> | IOperation<T>[];
  stale(steps: number): IOperation<T>[];
  reverse(steps: number): IOperation<T>[];
  all(): IOperation<T>[];
}

export default IHistory;
