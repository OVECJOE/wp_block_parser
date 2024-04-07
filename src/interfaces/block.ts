import { TUpdateBlockDTO } from "./block-dtos";

export type TBlockAttrs = Record<string, unknown>;

export interface IBlock {
  // fields
  readonly id: string;
  readonly attributes: TBlockAttrs;
  readonly content: string;
  readonly name: string;
  readonly children: IBlock[];
  readonly parent: IBlock | null;
  count: number;

  // methods
  append(child: IBlock): void;
  update(block: TUpdateBlockDTO | null): boolean;
  pop(): IBlock | null;
  remove(id: string): void;
  clear(): void;
  get(idx: number): IBlock | null;
  attr(name: string, _default?: unknown): unknown; // get or set an attribute
  hasAttr(name: string): boolean;
  removeAttr(name: string): void;
  isLeaf(): boolean;
  isRoot(): boolean;
  copy(deep: boolean, depth?: number): IBlock;
  path(stringify: boolean): IBlock[] | string;
  perform<T>(callback: (block: IBlock, result: T) => T, initial: T): T; // depth-first traversal
  serialize(toYAML?: boolean): string;
}
