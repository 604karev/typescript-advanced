interface IUser {
  name: string;
  age: number;
}

type KeyOfUser = keyof IUser;

export const key: KeyOfUser = "age";

export function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const user: IUser = {
  name: "Mike",
  age: 40,
};

export const userName = getValue(user, "name");

interface Data {
  group: number;
  name: string;
}

const obj = [
  { group: 1, name: "a" },
  { group: 1, name: "b" },
  { group: 2, name: "c" },
];

interface IGroup<T> {
  [key: string]: Array<T>;
}
type key = string | number | symbol;

function dataGroup<T extends Record<key, any>>(
  array: Array<T>,
  key: keyof T
): IGroup<T> {
  return array.reduce<IGroup<T>>((map: IGroup<T>, item) => {
    const itemKey = item[key];
    let curItem = map[itemKey];
    if (Array.isArray(curItem)) {
      curItem.push(item);
    } else {
      curItem = [item];
    }
    map[itemKey] = curItem;
    return map;
  }, {});
}

const res = dataGroup<Data>(obj, "group");
console.log(res);

let strOrNum: string | number;
let str20OrNum: typeof strOrNum;

const user1 = {
  name: "John",
};

type keyOfUser = keyof typeof user1;

enum Direction {
  Up,
  Down,
}

type IDirection = keyof typeof Direction;

