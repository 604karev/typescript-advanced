//Abstact factory

interface IInshurance {
  id: number;
  status: string;
  setVehicle(vehicle: any): void;
  submit(): Promise<boolean>;
}

class TFInsurance implements IInshurance {
  id: number;
  status: string;
  private vehicle: any;
  setVehicle(vehicle: any): void {
    this.vehicle = vehicle;
  }
  async submit(): Promise<boolean> {
    const res = await fetch("", {
      method: "POST",
      body: JSON.stringify({ vehicle: this.vehicle }),
    });
    const data = await res.json();
    return data.isSuccess;
  }
}

class ABInsurance implements IInshurance {
  id: number;
  status: string;
  private vehicle: any;
  setVehicle(vehicle: any): void {
    this.vehicle = vehicle;
  }
  async submit(): Promise<boolean> {
    const res = await fetch("", {
      method: "POST",
      body: JSON.stringify({ vehicle: this.vehicle }),
    });
    const data = await res.json();
    return data.isSomethingSuccess;
  }
}

abstract class InshuranceFactory {
  db: any;
  abstract createInsurance(): IInshurance;
  saveHistory(ins: IInshurance) {
    this.db.save(ins.id, ins.status);
  }
}

class TFInshuranceFactory extends InshuranceFactory {
  createInsurance(): TFInsurance {
    return new TFInsurance();
  }
}
class ABInshuranceFactory extends InshuranceFactory {
  createInsurance(): ABInsurance {
    return new ABInsurance();
  }
}
const tfInsuranceFactory = new TFInshuranceFactory();
const ins = tfInsuranceFactory.createInsurance();
tfInsuranceFactory.saveHistory(ins);

//Factory
const INSURANCE_TYPE = {
  tf: TFInsurance,
  ab: ABInsurance,
};
type IT = typeof INSURANCE_TYPE;

class InshuranceFactoryAlt {
  db: any;
  createInsurance<T extends keyof IT>(type: T): IT[T] {
    return INSURANCE_TYPE[type];
  }
  saveHistory(ins: IInshurance) {
    this.db.save(ins.id, ins.status);
  }
}

const insuranceFactoryAlt = new InshuranceFactoryAlt();
const ins2 = new (insuranceFactoryAlt.createInsurance("tf"))();

//Singleton

class MyMap {
  private static instance: MyMap;
  map: Map<number, string> = new Map();

  private constructor() {}

  clean() {
    this.map = new Map();
  }
  public static get(): MyMap {
    if (!MyMap.instance) {
      MyMap.instance = new MyMap();
    }
    return MyMap.instance;
  }
}

class Service1 {
  addMap(key: number, value: string) {
    const myMap = MyMap.get();
    myMap.map.set(key, value);
  }
}

class Service2 {
  getKeys(key: number) {
    const myMap = MyMap.get();
    myMap.map.get(key);
    myMap.clean();
    myMap.map.get(key);
  }
}

//Prototype

interface Prototype<T> {
  clone(): T;
}

class UserHistory implements Prototype<UserHistory> {
  createdAt: Date;
  constructor(public email: string, public name: string) {
    this.createdAt = new Date();
  }
  clone(): UserHistory {
    let target = new UserHistory(this.email, this.name);
    target.createdAt = this.createdAt;
    return target;
  }
}
let userProto = new UserHistory("test@text.com", "Mike");
let userClone = userProto.clone();

//Builder

enum ImageFormat {
  Png = "png",
  Jpeg = "jpeg",
}
interface IResolution {
  width: number;
  height: number;
}

interface IImageConversion extends IResolution {
  format: ImageFormat;
}
class ImageBuilder {
  private formats: ImageFormat[] = [];
  private resolutions: IResolution[] = [];

  addPng() {
    if (this.formats.includes(ImageFormat.Png)) {
      return this;
    }
    this.formats.push(ImageFormat.Png);
    return this;
  }

  addJpeg() {
    if (this.formats.includes(ImageFormat.Jpeg)) {
      return this;
    }
    this.formats.push(ImageFormat.Jpeg);
    return this;
  }
  addResolution(width: number, height: number) {
    this.resolutions.push({ width, height });
    return this;
  }
  build(): IImageConversion[] {
    const res: IImageConversion[] = [];
    for (const r of this.resolutions) {
      for (const f of this.formats) {
        res.push({
          format: f,
          width: r.width,
          height: r.height,
        });
      }
    }
    return res;
  }
}
console.log(
  new ImageBuilder()
    .addJpeg()
    .addPng()
    .addResolution(100, 50)
    .addResolution(500, 600)
    .build()
);
