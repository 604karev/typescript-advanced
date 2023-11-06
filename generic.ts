const num: Array<number> = [1, 2, 3];

async function returnNum() {
  const num = await new Promise<number>((resolve, reject) => {
    resolve(1);
  });
}

const check: Record<string, boolean> = {
  drive: true,
  kpp: false,
};

const check1: { [key: string]: boolean } = {
  drive: true,
  kpp: false,
};

function logMiddleware<T>(data: T): T {
  console.log(data);
  return data;
}
const res = logMiddleware<number>(10);

function getSplitedHalf<T>(data: Array<T>): Array<T> {
  const l = data.length / 2;
  return data.slice(0, l);
}

const res1 = getSplitedHalf([1, 3, "33"]);

function toString<T>(data: T): string | undefined {
  if (Array.isArray(data)) {
    return data.toString();
  }
  switch (typeof data) {
    case "string":
      return data;
    case "number":
    case "bigint":
    case "boolean":
    case "symbol":
    case "function":
      return data.toString();
    case "object":
      return JSON.stringify(data);
    default:
      return undefined;
  }
}
console.log(toString(3));
console.log(toString(true));
console.log(toString({ name: "Mike" }));
console.log(toString(["a", 2]));

const split: <T>(data: T[]) => T[] = getSplitedHalf;
const split2: <T>(data: Array<T>) => Array<T> = getSplitedHalf;

interface ILogLine<T> {
  timeSnap: Date;
  data: T;
}

type LogLineType<T> = {
  timeSnap: Date;
  data: T;
};

const logLine: ILogLine<{ a: number }> = {
  timeSnap: new Date(),
  data: {
    a: 1,
  },
};

interface Vehicle1 {
  speed: number;
}

function kmToMiles<T extends Vehicle1>(vehicle: T): T {
  vehicle.speed = vehicle.speed / 0.62;
  return vehicle;
}
interface LCV extends Vehicle1 {
  capacity: number;
}

kmToMiles({ speed: 1 });

function logId<T extends string | number, Y>(
  id: T,
  additionData: Y
): { id: T; data: Y } {
  return { id, data: additionData };
}
interface IUserData {
  id: number;
  name: string;
}

const userData = [
  {
    id: 1,
    name: "Dick",
  },
  {
    id: 3,
    name: "Bitch",
  },
  {
    id: 2,
    name: "Cunt",
  },
];

function dataSort<T extends Array<IUserData>>(
  data: T,
  route: "asc" | "desc" = "asc"
): Array<IUserData> {
  return data.sort((a, b) => {
    switch (route) {
      case "asc":
        return a.id - b.id;
      case "desc":
        return b.id - a.id;
    }
  });
}

console.log(dataSort(userData, "desc"));
console.log(dataSort(userData));

class Resp<D, E> {
  data?: D;
  error?: E;
  constructor(data?: D, error?: E) {
    if (data) {
      this.data = data;
    }
    if (error) {
      this.error = error;
    }
  }
}

class HTTPRes<F> extends Resp<string, number> {
  code!: F;

  setCode(code: F) {
    this.code = code;
  }
}

const responce = new HTTPRes();
