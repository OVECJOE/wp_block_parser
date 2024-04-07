import { IBlock } from "./block";

export enum STORAGE_FORMAT {
  JSON,
  YAML,
}

export interface ITree {
  readonly root: IBlock | null;
  readonly name?: string;
  add(block: IBlock, parentId: string): string | null;
  update(block: IBlock): boolean;
  remove(id: string): boolean;
  find(id: string, start: IBlock | null): IBlock | null;
  query(selector: string): IBlock[] | null;
  subTree(selector: string): ITree | null;
  serialize(format: STORAGE_FORMAT): string;
}
