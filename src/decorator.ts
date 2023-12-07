import "reflect-metadata";

const POSITIVE_METADATE_KEY = Symbol("POSITIVE_METADATE_KEY");

interface IUserService {
  users: number;
  getUsersInDatabase(): number;
}

@NullUser
@SetUsers(2)
@Log()
@SetUserAdvanced(34)
@NullUserAdvanced
@CreatedAt
export class UserService implements IUserService {
  // @Max(100)
  private _users: number = 1000;
  set users(num: number) {
    this._users = num;
  }

  @LogAccessor()
  get users() {
    return this._users;
  }

  @LogMethod()
  @CatchError({ rethrow: true })
  getUsersInDatabase(): number {
    console.log(num);
    throw new Error("Error");
  }
  @Validate()
  setUsersInDatabase(@Positive() num: number): void {
    this._users = num;
  }
}
function Log() {
  console.log("log init");
  return (target: Function) => {
    console.log("log run");
  };
}

function NullUser(target: Function) {
  target.prototype.users = 0;
}

function LogUser(obj: IUserService) {
  console.log("Users: " + obj.users);
  return obj;
}

function NullUserAdvanced<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    users = 3;
  };
}
function SetUserAdvanced(users: number) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      users = users;
    };
  };
}
// console.log(nullUser(new UserService()).getUsersInDatabase());
// console.log(logUser(nullUser(new UserService())).getUsersInDatabase());

//decorator factory

function SetUsers(users: number) {
  console.log("setUsers init");
  return (target: Function) => {
    console.log("setUsers run");
    target.prototype.users = users;
  };
}

function CreatedAt<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    createdAt = new Date();
  };
}
interface ICreatedAt {
  createdAt: Date;
}

//methods decorator
function LogMethod() {
  return (
    target: Object,
    propsKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ): TypedPropertyDescriptor<(...args: any[]) => any> | void => {
    descriptor.value = () => {
      const oldMethod = descriptor.value;
      console.log("No Error");
      oldMethod;
    };
  };
}

function CatchError({ rethrow }: { rethrow: boolean } = { rethrow: false }) {
  return (
    target: Object,
    propsKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ): TypedPropertyDescriptor<(...args: any[]) => any> | void => {
    const method = descriptor.value;
    descriptor.value = (...args: any[]) => {
      try {
        console.log(target, args);
        return method?.apply(target, args);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e);
          if (rethrow) {
            throw e;
          }
        }
      }
    };
  };
}

// property decorator
function Max(max: number) {
  return (target: Object, propsKey: string | symbol) => {
    let value: number;
    const setter = function (newValue: number) {
      if (newValue > max) {
        console.log(`You can't set value more than ${max}`);
      } else {
        value = newValue;
      }
    };
    const getter = function () {
      return value;
    };
    Object.defineProperty(target, propsKey, {
      set: setter,
      get: getter,
    });
  };
}
const userService = new UserService();
userService.users = 1;
console.log(userService.users);
userService.users = 1000;

//accessor decorator
function LogAccessor() {
  return (
    target: Object,
    propsKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const set = descriptor.set;
    descriptor.set = (...args: any) => {
      console.log(args);
      set?.apply(target, args);
    };
  };
}
//parameter decorator and metadata

function Positive() {
  return (
    target: Object,
    propsKey: string | symbol,
    parameterIndex: number
  ) => {
    console.log(Reflect.getOwnMetadata("design:type", target, propsKey));
    console.log(Reflect.getOwnMetadata("design:paramtypes", target, propsKey));
    console.log(Reflect.getOwnMetadata("design:returntype", target, propsKey));
    let existParams: number[] =
      Reflect.getMetadata(POSITIVE_METADATE_KEY, target, propsKey) || [];
    existParams.push(parameterIndex);
    Reflect.defineMetadata(POSITIVE_METADATE_KEY, target, propsKey);
  };
}

function Validate() {
  return (
    target: Object,
    propsKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) => {
    let method = descriptor.value;
    descriptor.value = function (...args: any) {
      let positiveParams: number[] = Reflect.getMetadata(
        POSITIVE_METADATE_KEY,
        target,
        propsKey
      );
      if (positiveParams) {
        for (let i of positiveParams) {
          if (args[i] < 0) {
            throw new Error("Number should be more then 0");
          }
        }
      }
      return method?.apply(this, args);
    };
  };
}

//decorator order

function Uni(name: string): any {
  console.log(`init ${name}`);
  return function () {
    console.log(`call ${name}`);
  };
}

@Uni("Class")
export class MyClass {
  @Uni('Property')
  prop?: any;

  @Uni('Static property')
  static prop2?: any;

  @Uni("Method")
  method(@Uni("params method") _: any) {}

  @Uni("Method static")
  static method(@Uni("params method static") _: any) {}

  constructor(@Uni("params construstor") _: any) {}
}
// init Property
// call Property
// init Method
// init params method
// call params method
// call Method
// init Static property
// call Static property
// init Method static
// init params method static
// call params method static
// call Method static
// init Class
// init params construstor
// call params construstor
// call Class