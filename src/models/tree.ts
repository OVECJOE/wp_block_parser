import { IBlock, STORAGE_FORMAT, ITree, TUpdateBlockDTO } from "@/interfaces";

/**
 * @summary A Block Tree Model
 * @description It is used to manage content-related blocks in a tree-like structure.
 * @implements ITree
 */
class Tree implements ITree {
  /**
   * Create a new Block Tree Model
   * @param name the name of the tree
   * @param root the root block of the tree
   */
  constructor(
    readonly name: string, // the name of the tree
    readonly root: IBlock | null, // the root block of the tree
  ) {}

  /**
   * Estimate the size of the tree
   * @returns the size
   */
  get size(): number {
    return this.root?.count || 0;
  }

  /**
   * Add a new block to the tree
   * @param {IBlock} block the block to add to the tree
   * @param {string} parentId the id of the parent block
   *
   * @returns the id of the newly added block or null if the parent block was not found
   * @example
   * ```typescript
   * const tree = new Tree('root', new Block('root', 'root', 'root'))
   * tree.add(new Block('child', 'child', 'child'), 'root')
   * ```
   */
  add(block: IBlock, parentId: string): string | null {
    const parent = this.find(parentId);
    if (!parent) {
      return null;
    }

    parent.append(block);
    return block.id;
  }

  /**
   * Update a block in the tree
   * @param {TUpdateBlockDTO} block the block to update
   *
   * @returns true if the block was updated, false otherwise
   * @example
   * ```typescript
   * const tree = new Tree('root', new Block('root', 'root', 'root'))
   * tree.update({ id: 'root', name: 'new name', content: 'new content' })
   * ```
   */
  update(block: TUpdateBlockDTO & { id: string }): boolean {
    const existing = this.find(block.id);
    if (!existing) {
      return false;
    }

    existing.update(block as Omit<typeof block, "id">);
    return true;
  }

  /**
   * Find a block in the tree by its id
   * @param {string} id the id of the block to find
   * @param {IBlock | null} start the block to start the search from
   *
   * @returns the block if found, null otherwise
   * @example
   * ```typescript
   * const tree = new Tree('root', new Block('root', 'root', 'root'))
   * tree.find('root')
   * ```
   */
  find(id: string, start: IBlock | null = this.root): IBlock | null {
    if (!start || start.id === id) {
      return start;
    }

    for (const child of start.children) {
      const block = this.find(id, child);
      if (block) {
        return block;
      }
    }

    return null;
  }

  /**
   * Remove a block from the tree
   * @param {string} id the id of the block to remove
   *
   * @returns true if the block was removed, false otherwise
   * @example
   *
   * ```typescript
   * const tree = new Tree('root', new Block('root', 'root', 'root'))
   * tree.remove('root')
   * ```
   */
  remove(id: string): boolean {
    const block = this.find(id);
    if (!block) {
      return false;
    }

    block.parent?.remove(id);
    return true;
  }

  /**
   * Query the tree for blocks that match a selector
   *
   * The selector can be one of the following:
   * - [key]=[value] - find blocks with an attribute that matches the key and value
   * - .[content] - find blocks whose content includes the selector
   * - [tag] - find blocks whose name matches the tag
   *
   * @param {string} selector the selector to query the tree with
   *
   * @returns the blocks that match the selector
   * @example
   * ```typescript
   * btm.query('tag:wp')
   * ```
   */
  query(selector: string): IBlock[] | null {
    if (!this.root) {
      return null;
    }

    if (selector.includes("=")) {
      const [key, value] = selector.split("=");
      return this.root.perform<IBlock[]>((block, result) => {
        if (block.attr(key) === value) {
          result.push(block);
        }
        return result;
      }, []);
    }

    if (selector.startsWith(".")) {
      const content = selector.slice(1);
      return this.root.perform<IBlock[]>((block, result) => {
        if (block.content.includes(content)) {
          result.push(block);
        }
        return result;
      }, []);
    }

    return this.root.perform<IBlock[]>((block, result) => {
      if (block.name === selector) {
        result.push(block);
      }
      return result;
    }, []);
  }

  /**
   * Get a sub-tree of the tree that matches a selector
   * @param selector the selector to match the sub-tree with
   * @returns the sub-tree that matches the selector
   */
  subTree(selector: string): Tree | null {
    const blocks = this.query(selector);
    if (!blocks) {
      return null;
    }

    const root = blocks[0].copy(true);
    for (let i = 1; i < blocks.length; i++) {
      root.append(blocks[i].copy(true));
    }

    return new Tree(this.name, root);
  }

  /**
   * Serialize the tree to a string
   * @param format the format to serialize the tree to
   * @returns the serialized tree
   */
  serialize(format: STORAGE_FORMAT = STORAGE_FORMAT.JSON): string {
    return this.root?.serialize(format === STORAGE_FORMAT.YAML) ?? "";
  }
}

export default Tree;
