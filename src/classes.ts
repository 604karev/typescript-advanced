class Admin {
  role!: number;
}

const newAdmin = new Admin();

class User {
  firstName?: string;
  age?: number;
  //constructor overload
  constructor();
  constructor(firstName: string);
  constructor(age: number);
  constructor(firstName: string, age: number);
  constructor(nameOrAge?: string | number, age?: number) {
    if (typeof nameOrAge === "string") {
      this.firstName = nameOrAge;
    }
    if (typeof age === "number") {
      this.age = age;
    }
  }
}

const newUser = new User("Alex");
const unknownUser = new User();
const user33 = new User(33);
const Alex33 = new User("Alex", 33);

enum PaymentStatus {
  Holded,
  Processed,
  Reversed,
}

class Payment {
  id: number;
  status: PaymentStatus = PaymentStatus.Holded;
  createdAt: Date = new Date();
  updatedAt?: Date;

  constructor(id: number) {
    this.id = id;
  }
  getPaymentLifeTime() {
    return new Date().getTime() - this.createdAt.getTime();
  }
  unholdPayment() {
    if (this.status == PaymentStatus.Holded) {
      throw Error("The payment can't be returned");
    }
    this.status = PaymentStatus.Reversed;
    this.updatedAt = new Date();
  }
}

const newPayment = new Payment(1);
const time = newPayment.getPaymentLifeTime();

class Item {
  skillsList: string[] = [];
  overloadMethod(skill: string): void;
  overloadMethod(skills: string[]): void;

  overloadMethod(skillsOrSkill: string | string[]): void {
    if (typeof skillsOrSkill === "string") {
      this.skillsList.push(skillsOrSkill);
    } else {
      this.skillsList.concat(skillsOrSkill);
    }
  }
}

function overloadFunction(item: string): string;
function overloadFunction(item: number): number;
function overloadFunction(item: string | number): string | number {
  if (typeof item === "string") {
    return "";
  } else return 1;
}

class UserDev {
  _login!: string;
  password!: string;

  set login(l: string) {
    this._login = "user-" + l;
  }
  get login() {
    return this._login;
  }
}

const userDev = new UserDev();
userDev.login = "my-login";

interface ILogger {
  log(...args: any): void;
  error(...args: any): void;
}

class Logger implements ILogger {
  log(...args: any): void {
    throw new Error("Method not implemented.");
  }
  async error(...args: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

type PaymentStatus1 = "new" | "paid";

class Payment1 {
  id: number;
  status: PaymentStatus1 = "new";

  constructor(id: number) {
    this.id = id;
  }
  pay() {
    this.status = "paid";
  }
}

class PersistencePayment extends Payment1 {
  databaseId!: number;
  paidAt!: Date;

  constructor() {
    const id = Math.random();
    super(id);
  }

  save() {}
  //override method
  override pay(date?: Date) {
    // super.pay();
    if (date) {
      this.paidAt = date;
    }
  }
}

const mypayment = new PersistencePayment();

class User1 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
class Users1 extends Array<User1> {
  searchByName(name: string) {
    return this.filter((u) => u.name === name);
  }
  override toString(): string {
    return this.map((u) => u.name).join(", ");
  }
}

const users1 = new Users1();
users1.push(new User1("Jack"));
users1.push(new User1("Mike"));

console.log(users1.toString());

class Payment2 {
  date!: Date;
}

//inheritance

class UserWithPayment extends Payment2 {
  name!: string;
}

//composition

class UserWithPayment1 {
  user: User1;
  payment: Payment2;
  constructor(user: User1, payment: Payment2) {
    (this.payment = payment), (this.user = user);
  }
}

class Vehicle {
  public make!: string; // accesable in instance, class and extended class, defaul state
  private damages!: string[]; // accesable only in class and don't accesable extended class can acces with methods, getters and setters
  private _model!: string;
  protected run!: number; // assesable as a private, but accessable in extended class
  #price!: number; //private fron Js

  set model(model: string) {
    this._model = model;
    this.#price = 100;
  }

  get model() {
    return this._model;
  }
  addDamage(damage: string) {
    this.damages.push();
  }

  isPriceEqual(v: Vehicle) {
    this.#price === v.#price;
  }
}


class EuroTruck extends Vehicle {
  serRun(km: number) {
    this.run = km * 0.62;
    //this.damage error
    //this.#price=100 error
  }
}

class UserService {
  private static db: any;

  static getUser(id: number) {
    return UserService.db.find(id);
  }
  create() {
    UserService.db;
  }
  static {
    UserService.db = "";
  }
}

UserService.getUser(1);
const inst = new UserService();
inst.create();

//context

class Payment3 {
  private date: Date = new Date();
  getDate(this: Payment3 | this) {
    return this.date;
  }
  getDateArrow = () => {
    return this.date;
  };
}

const p = new Payment3();

const user2 = {
  id: 1,
  getPaymentDate: p.getDate.bind(p),
  getPaymentDateArrow: p.getDateArrow(),
};

p.getDate();
user2.getPaymentDate();

class PaymentPersistent1 extends Payment3 {
  save() {
    super.getDate();
    // super.getDateArrow() error
    this.getDateArrow();
  }
}

class UserBuilder {
  name!: string;

  setName(name: string): this {
    this.name = name;
    return this;
  }
  //context type guard
  isAdmin(): this is AdminBuilder {
    return this instanceof AdminBuilder;
  }
}

class AdminBuilder extends UserBuilder {
  roles!: string[];
}

const user3: UserBuilder | AdminBuilder = new UserBuilder();
if (user3.isAdmin()) {
  console.log(user3);
} else {
  console.log(user3);
}

//abstraction

abstract class Controller {
  //abstact method used only in abstract class
  abstract handle(req: any): void;
  handelWithLogs(req: any) {
    console.log("Start");
    this.handle(req);
    console.log("End");
  }
}
// new Controller() - errror

class UserController extends Controller {
  handle(req: any): void {
    console.log(req);
  }
}

const c = new UserController();

c.handelWithLogs("Request");
c.handle("");
