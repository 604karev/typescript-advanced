export interface IUser {
  name: string;
  age?: number;
  email: string;
}

type PartialType = Partial<IUser>;
const p: PartialType = {};

type RequiredType = Required<IUser>;
type ReadonlyType = Readonly<IUser>;
type RequiredReadonlyType = Required<Readonly<IUser>>;

export interface PaymentPersistent {
  id: number;
  sum: number;
  from: string;
  to: string;
}

type Payment = Omit<PaymentPersistent, "id">;
type PaymentRequisits = Pick<PaymentPersistent, "from" | "to">;

type ExtractType = Extract<"from" | "to" | Payment, string>;
type ExcludeType = Exclude<"from" | "to" | Payment, string>;

class User {
  constructor(public id: number, public name: string) {}
}

function getData(id: number) {
  return new User(id, "Sam");
}
type TypeReturn = ReturnType<typeof getData>;
type TypeReturn1 = ReturnType<() => void>;
type TypeReturn2 = ReturnType<<T>() => T>;
type TypeReturn3 = ReturnType<<T extends string>() => T>;

type ParamsType = Parameters<typeof getData>;
type FirstParamsType = ParamsType[0];

type ConstuctorParametersType = ConstructorParameters<typeof User>;
type TypeInstance = InstanceType<typeof User>;

type A = Awaited<Promise<string>>;
type A2 = Awaited<Promise<Promise<string>>>;

interface IMenu {
  name: string;
  url: string;
}

type R = Awaited<ReturnType<typeof getMenu>>;
async function getMenu(): Promise<IMenu[]> {
  const res: R = await [{ name: "Analytics", url: "/analytics" }];
  return res;
}

async function getArray<T>(x: T): Promise<Awaited<T>[]> {
  return [await x];
}

async function getArray1<T>(x: T): Promise<T[]> {
  return [await x];
}
