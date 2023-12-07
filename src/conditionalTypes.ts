const a: number = Math.random() > 0.5 ? 1 : 0;

export interface HTTPResponce<T extends "success" | "failed"> {
  code: number;
  date: T extends "success" ? string : Error;
  additionalDate: T extends "success" ? string : number;
}

const suc: HTTPResponce<"success"> = {
  code: 200,
  date: "done",
  additionalDate: "ddd",
};

const err: HTTPResponce<"failed"> = {
  code: 403,
  date: new Error(),
  additionalDate: 11,
};

class User {
  id!: number;
  name!: string;
}

class UserPersisted extends User {
  dbId!: string;
}

function getUser(id: number): User;
function getUser(dbId: string): UserPersisted;
function getUser(dbIdOrid: string | number): User | UserPersisted {
  if (typeof dbIdOrid === "string") {
    return new User();
  } else {
    return new UserPersisted();
  }
}

type UserOrUserPersisted<T extends string | number> = T extends string
  ? User
  : UserPersisted;

function getUser2<T extends string | number>(id: T): UserOrUserPersisted<T> {
  if (typeof id === "string") {
    return new User() as UserOrUserPersisted<T>;
  } else {
    return new UserPersisted() as UserOrUserPersisted<T>;
  }
}

const res1 = getUser2(1)
const res2 = getUser2("ddd")