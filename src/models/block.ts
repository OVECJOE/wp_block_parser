import { v4 as uuidv4 } from "uuid";
import { IBlock, TBlockAttrs, TUpdateBlockDTO } from "@/interfaces";
import { BlockSerializer } from "@/services/serializers";

class Block implements IBlock {
  readonly id: string;
  readonly attributes: TBlockAttrs;
  readonly MAX_DEPTH = 512;

  /**
   * Create a new block
   * @param _parent Block's parent
   * @param _name Block's name such as 'kadence/faq-block'
   * @param _content Block's content; might be empty for self-closing shortcodes
   * @param _children Block's children
   * @param attrs Block's attributes
   */
  constructor(
    private _parent: Block | null,
    private _name: string,
    private _content: string,
    private _children: Block[],
    attrs: string,
  ) {
    this.id = uuidv4(); // generate a unique identifier for the block

    // parse the attributes string into a key-value object
    const attributes = attrs.split(/\s+/).reduce((acc, attr) => {
      const [key, value] = attr.split("=");
      acc[key] = JSON.parse(value);
      return acc;
    }, {} as TBlockAttrs);

    this.attributes = new Proxy(attributes, {
      get(target, prop: string): unknown {
        return target[prop] || null;
      },

      set(target, prop: string, value: string): boolean {
        target[prop] = JSON.parse(value);
        return true;
      },

      deleteProperty(target, prop: string): boolean {
        delete target[prop];
        return true;
      },

      ownKeys(target): string[] {
        return Object.keys(target);
      },

      has(target, prop: string): boolean {
        return prop in target;
      },
    });
  }

  get content(): string {
    return this._content;
  }

  get name(): string {
    return this._name;
  }

  get parent(): Block | null {
    return this._parent;
  }

  get children(): Block[] {
    return this._children;
  }

  get count(): number {
    return this._children.length;
  }

  /**
   * Add a new child block to the list of children
   * @param child the block to append to the list of children
   */
  append(child: Block): void {
    this._children.push(child);
  }

  /**
   * Update the block with new data
   * @param block the block to update
   * @returns true if the block was updated, false otherwise
   */
  update(block: TUpdateBlockDTO | null): boolean {
    if (!block) {
      return false;
    }

    if (block.name) {
      this._name = block.name;
    }

    if (block.content) {
      this._content = block.content;
    }

    return true;
  }

  /**
   * Remove the last child block from children array
   * @return {Block | null} the removed block or null if no children
   */
  pop(): Block | null {
    return this._children.pop() || null;
  }

  /**
   * Remove a child from the list of children.
   * @param id the id of the child block to remove
   */
  remove(id: string): void {
    this._children = this._children.filter((c) => c.id !== id);
  }

  /**
   * Remove all blocks from the list of children
   */
  clear(): void {
    this._children = [];
  }

  /**
   * Get child block by index.
   * @param idx the index of the child block to retrieve. Negative indexes are allowed.
   * @returns the child block or null if not found
   */
  get(idx: number): Block | null {
    const index = idx < 0 ? this.count + idx : idx;

    if (index >= this.count) {
      return null;
    }

    return this._children[idx];
  }

  /**
   * Get or set an attribute
   * @param name the name of the attribute
   * @param _default the default value to return if the attribute is not set
   * @returns the value of the attribute or the default value
   */
  attr(name: string, _default?: unknown): unknown {
    if (!this.hasAttr(name) && _default !== undefined) {
      this.attributes[name] = _default;
    }

    return this.attributes[name] || _default;
  }

  /**
   * Check if an attribute exists
   * @param name the name of the attribute
   * @returns true if the attribute exists, false otherwise
   */
  hasAttr(name: string): boolean {
    return name in this.attributes;
  }

  /**
   * Remove an attribute
   * @param name the name of the attribute to remove
   */
  removeAttr(name: string): void {
    delete this.attributes[name];
  }

  /**
   * Check if the block is a leaf node
   * @returns true if the block has no children, false otherwise
   */
  isLeaf(): boolean {
    return this.count === 0;
  }

  /**
   * Check if the block is a root node
   * @returns true if the block has no parent, false otherwise
   */
  isRoot(): boolean {
    return this._parent === null;
  }

  /**
   * Create a copy of the block
   * @param deep whether to create a deep copy of the block
   * @param depth the depth of the copy. If 0, only the block itself is copied.
   * @returns a deep copy of the block
   */
  copy(deep = false, depth = this.MAX_DEPTH): Block {
    // copy the block itself
    const copy = new Block(this._parent, this._name, this._content, [], "");

    // copy the attributes
    for (const key in this.attributes) {
      copy.attr(key, this.attributes[key]);
    }

    if (deep && depth > 0) {
      // copy the children
      for (const child of this._children) {
        copy.append(child.copy(deep, depth - 1));
      }
    }

    return copy;
  }

  /**
   * Get the path of the block
   * @param stringify whether to return the path as a string or an array of blocks
   * @returns the path of the block
   */
  path(stringify = false): Block[] | string {
    const path: Block[] = [];
    let current: Block | null = this.copy();

    while (current) {
      path.push(current);
      current = current.parent;
    }

    return stringify ? path.map((b) => b.id).join(" -> ") : path;
  }

  /**
   * Traverse the block and its children in depth-first order and call a callback function for each block
   * @param callback the callback function to call for each block
   * @param initial the initial value to pass to the callback
   * @returns the result of the traversal
   */
  perform<T>(callback: (block: Block, result: T) => T, initial: T): T {
    let result = callback(this, initial);

    for (const child of this._children) {
      result = child.perform(callback, result);
    }

    return result;
  }

  /**
   * Serialize the block to a JSON string
   * @returns the JSON string representation of the block
   */
  serialize(toYAML = false): string {
    return toYAML ? BlockSerializer.toYAML(this) : BlockSerializer.toJSON(this);
  }

  toString(): string {
    return this.serialize(true);
  }
}

export default Block;
