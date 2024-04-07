import yaml from "js-yaml";
import { IBlock, IBlockDTO } from "@/interfaces";

/**
 * Serializes a block into a string of JSON or YAML format
 */
export class BlockSerializer {
  /**
   * Serialize a block to a JSON string
   * @param block the block to serialize
   * @returns the JSON string representation of the block
   *
   * @static
   */
  static toJSON(block: IBlock): string {
    return JSON.stringify(
      {
        parent: block.parent?.id ?? null,
        id: block.id,
        name: block.name,
        content: block.content,
        attributes: block.attributes,
        children: block.children.map((child) => BlockSerializer.toJSON(child)),
      },
      null,
      2,
    );
  }

  /**
   * Deserialize a JSON string into a block
   * @param json the JSON string to deserialize
   * @returns the block representation of the JSON string
   *
   * @static
   */
  static fromJSON(json: string): IBlockDTO {
    return JSON.parse(json) as IBlockDTO;
  }

  /**
   * Serialize a block to a YAML string
   * @param block the block to serialize
   * @returns the YAML string representation of the block
   *
   * @static
   */
  static toYAML(block: IBlock): string {
    return yaml.dump(
      {
        parent: block.parent?.id ?? null,
        id: block.id,
        name: block.name,
        content: block.content,
        attributes: block.attributes,
        children: block.children.map((child) => BlockSerializer.toYAML(child)),
      },
      {
        schema: yaml.DEFAULT_SCHEMA,
      },
    );
  }

  /**
   * Deserialize a YAML string into a block
   * @param yaml the YAML string to deserialize
   * @returns the block representation of the YAML string
   *
   * @static
   */
  static fromYAML(data: string): IBlockDTO {
    return yaml.load(data, {
      schema: yaml.DEFAULT_SCHEMA,
    }) as IBlockDTO;
  }
}
