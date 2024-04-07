import { TBlockAttrs } from "./block";

interface IBlockDTO {
  id: string;
  attributes: TBlockAttrs;
  content: string;
  name: string;
  children: IBlockDTO[];
  parent: string | null;
}

type TUpdateBlockDTO = Pick<Partial<IBlockDTO>, "name" | "content">;

export { IBlockDTO, TUpdateBlockDTO };
