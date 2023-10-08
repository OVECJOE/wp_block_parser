import fs from "fs"

import { BASE_PATH, JSON_DIRNAME } from "../../index.js"
import Shortcode from "./shortcode.js"
import DBManager from "../db_manager.js"

enum FORMAT {
    JSON,
    DATABASE
}

class ShortcodeTree {
    private readonly _root: Shortcode // the root shortcode of the tree

    constructor(
        readonly name: string // the name of the tree
    ) {
        this._root = new Shortcode(null, 'root', '', [], {})
    }

    get root(): Shortcode | null {
        return this._root
    }

    /**
     * Add a new shortcode to the tree
     * @param shortcode the shortcode to add to the tree
     * @param parentId the id of the parent shortcode
     * @returns the id of the newly added shortcode
     */
    add(shortcode: Shortcode, parentId: string): string | null {
        const parent = this.find(parentId)

        if (parent) {
            parent.append(shortcode)
            return shortcode.id
        }

        return null
    }

    /**
     * Remove a shortcode from the tree
     * @param id the id of the shortcode to remove
     * @returns true if the shortcode was removed, false otherwise
     */
    remove(id: string): boolean {
        const shortcode = this.find(id)

        if (shortcode) {
            shortcode.parent?.remove(id)
            return true
        }

        return false
    }

    /**
     * Find a shortcode in the tree by its id
     * @param id the id of the shortcode to find
     * @returns the shortcode if found, null otherwise
     */
    find(id: string, start: Shortcode = this._root): Shortcode | null {
        if (start.id === id) {
            return start
        }

        for (const child of start.children) {
            const result = this.find(id, child)
            if (result) {
                return result
            }
        }

        return null
    }

    /**
     * Save the tree to either a JSON file  or a DB
     * @param format the format to save the tree in (JSON or DB)
     * @param callback the callback to call when the tree is saved
     * @returns true if the tree was saved, false otherwise
     */
    async save(format: FORMAT = FORMAT.JSON, callback?: (tree: ShortcodeTree, result: boolean) => void): Promise<boolean> {
        let success = false

        try {
            // check if the base path exists and is writable and readable
            await fs.promises.access(BASE_PATH, fs.constants.W_OK | fs.constants.R_OK)

            // create the json directory if it doesn't exist
            await fs.promises.mkdir(JSON_DIRNAME, { recursive: true })

            switch (format) {
                case FORMAT.JSON:
                    // create the json file if it doesn't exist
                    const file = await fs.promises.open(`${JSON_DIRNAME}/${this.name}.json`, 'w')
        
                    // write the json to the file
                    await file.writeFile(this._root.serialize(), 'utf8')

                    // close the file
                    await file.close()

                    break
                case FORMAT.DATABASE:
                    await DBManager.save(this._root.serialize(), callback)
                default:
                    break
            }

            // set the success flag to true
            success = true
        } catch (err) {
            console.error(err)
        } finally {
            // call the callback if it exists
            if (callback) {
                callback(this, true)
            }
        }

        return success
    }

    /**
     * Populate the tree with shortcodes from an html content
     * @param content the html content to parse
     * @returns true if the tree was populated, false otherwise
     */
    populate(content: string): boolean {
        return false
    }
}

export default ShortcodeTree
