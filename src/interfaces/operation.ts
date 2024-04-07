export enum Operator {
  CREATE,
  READ,
  UPDATE,
  DELETE,
}

export interface IOperation<T> {
  opcode: Operator;
  data: T;
  timestamp: number;
  origin?: symbol;
}
