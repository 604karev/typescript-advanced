type ReadOrWrite = "read" | "write";
type Bulk = "bulk" | "";

type Access = `can${Capitalize<ReadOrWrite>}${Capitalize<Bulk>}`;

type ErrorOrSuccess = "error" | "success";

type ReadOrWriteBulk<T> = T extends `can${infer R}` ? R : never;

type InferBulk = ReadOrWriteBulk<Access>;

export type Responce = {
  result: `http${Capitalize<ErrorOrSuccess>}`;
};

const res: Responce = {
  result: "httpError",
};
