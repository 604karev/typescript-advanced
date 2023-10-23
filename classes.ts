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


