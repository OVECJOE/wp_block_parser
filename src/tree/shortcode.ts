import { generateUniqueID } from "../helpers/functions.js";

class Shortcode {
    readonly id: string; // shortcode's unique identifier
    private attributes: string // shortcode's attributes, usually a JSON string

    constructor(
        private _parent: Shortcode | null, // shortcode's parent
        private _name: string, // shortcode's name such as 'cs_column_text'
        private _content: string, // shortcode's content; might be empty for self-closing shortcodes
        private _children: Shortcode[], // shortcode's children
        attributes: Record<string, string>
    ) {
        this.id = generateUniqueID()
        this.attributes = JSON.stringify(attributes)
    }

    get content(): string {
        return this._content
    }

    get name(): string {
        return this._name
    }

    get parent(): Shortcode | null {
        return this._parent
    }

    get children(): Shortcode[] {
        return this._children
    }

    get count(): number {
        return this._children.length
    }

    /**
     * Add a new child shortcode to the list of children
     * @param child the shortcode to append to the list of children
     */
    append(child: Shortcode): void {
        this._children.push(child)
    }

    /**
     * Remove a child from the list of children.
     * @param childId the id of the child shortcode to remove
     */
    remove(childId: string): void {
        this._children = this._children.filter(c => c.id !== childId)
    }

    /**
     * remove all shortcodes from the list of children
     */
    clear(): void {
        this._children = []
    }

    /**
     * Get child shortcode by index.
     * @param index the index of the child shortcode to retrieve
     * @returns the child shortcode or null if not found
     */
    get(index: number): Shortcode | null {
        if (index >= this._children.length) {
            return null
        }

        // for negative indexes, start from the end of the list
        if (index < 0) {
            index = this._children.length + index
        }

        return this._children[index]
    }

    /**
     * Retrieve the value of a specific attribute by name.
     * @param name the name of the attribute
     * @returns the value of the attribute or undefined if not found
     */
    getAttribute(name: string, _default?: undefined): string | undefined {
        const attributes = JSON.parse(this.attributes)
        return attributes[name] ?? _default
    }

    /**
     * Set the value of a specific attribute by name.
     * @param name the name of the attribute
     * @param value the value of the attribute
     */
    setAttribute(name: string, value: string): void {
        const attributes = JSON.parse(this.attributes)
        attributes[name] = value

        // JSONify the attributes again
        this.attributes = JSON.stringify(attributes)
    }

    /**
     * Check if an attribute exists by name.
     * @param name the name of the attribute
     * @return true if the attribute exists else false
     */
    hasAttribute(name: string): boolean {
        const attributes = JSON.parse(this.attributes)
        return name in attributes
    }

    /**
     * Checks if the shorcode is a leaf node.
     * @returns true if the current shortcode is a leaf else false
     */
    isLeaf(): boolean {
        return this._children.length === 0
    }

    /**
     * Checks if the shorcode is a root node
     * @returns true if the current shortcode is the root else false
     */
    isRoot(): boolean {
        return this.parent === null
    }

    /**
     * create a deep clone of the current node and its subtree
     * @returns a clone of the current shortcode
     */
    clone(): Shortcode {
        const clone = new Shortcode(
            this._parent,
            this._name,
            this._content,
            [],
            JSON.parse(this.attributes)
        )

        // clone all children
        this._children.forEach(child => {
            clone.append(child.clone())
        })

        return clone
    }

    /**
     * Get the path of the current shortcode.
     * @param stringify if true, the path will be returned as a string
     * @returns the path of the current shortcode
     */
    getPath(stringify: boolean = false): Shortcode[] | string {
        const path: Shortcode[] = []
        let current: Shortcode | null = this

        while (current !== null) {
            path.push(current)
            current = current.parent
        }

        return stringify ? path.map(s => s.name).join('/') : path
    }

    /**
     * Serialize the current shortcode to a JSON string.
     * @returns the JSON string representation of the current shortcode
     */
    serialize(): string {
        return JSON.stringify({
            parent: this.parent?.id ?? null,
            id: this.id,
            name: this.name,
            content: this.content,
            attributes: JSON.parse(this.attributes),
            children: this.children.map(child => child.serialize())
        }, null, 2)
    }

    toString(): string {
        return this.serialize()
    }

    /**
     * Traverse the shortcode and accumulate a result by applying a callback
     * function to the shortcode and all its children.
     *
     * @param callback - The callback function to apply to each node.
     * @param initialResult - The initial result value.
     * 
     * @returns The accumulated result.
     */
    traverse<T>(callback: (shortcode: Shortcode, result: T) => T, initialResult: T): T {
        let result = callback(this, initialResult);
    
        for (const child of this._children) {
          result = child.traverse(callback, result);
        }
    
        return result;
    }
}