//Bridge

interface IProvider {
  sendMesage(message: string): void;
  connect(config: string): void;
  disconnect(): void;
}

class TelegramProvider implements IProvider {
  sendMesage(message: string): void {
    console.log(message);
  }
  connect(config: string): void {
    console.log(`${config} TG`);
  }
  disconnect(): void {
    console.log("Disconnected TG");
  }
}

class WatsUpProvider implements IProvider {
  sendMesage(message: string): void {
    console.log(message);
  }
  connect(config: string): void {
    console.log(`${config} WatsUp`);
  }
  disconnect(): void {
    console.log("Disconnected WatsUp");
  }
}

class NotifficationSender {
  constructor(private provider: IProvider) {}
  send() {
    this.provider.connect("connect");
    this.provider.sendMesage("message");
    this.provider.disconnect();
  }
}
class DelayNotifficationSender extends NotifficationSender {
  constructor(provider: IProvider) {
    super(provider);
  }
  sendDelayed() {
    setTimeout(() => this.send(), 5000);
  }
}

const tgSender = new NotifficationSender(new TelegramProvider());
tgSender.send();
const wuSender = new NotifficationSender(new WatsUpProvider());
wuSender.send();

//Facade

class Notify {
  send(template: string, to: string) {
    console.log(`send ${template} to ${to}`);
  }
}

class Log {
  log(message: string) {
    console.log(message);
  }
}

class Template {
  private templates = [
    {
      name: "other",
      template: "<h1>Template</h1>",
    },
  ];
  getByName(name: string) {
    return this.templates.find((t) => t.name === name);
  }
}

class NotifficationFacade {
  private notifier: Notify;
  private logger: Log;
  private template: Template;
  constructor() {
    this.notifier = new Notify();
    this.template = new Template();
    this.logger = new Log();
  }

  send(to: string, templateName: string) {
    const data = this.template.getByName(templateName);
    if (!data) {
      this.logger.log("data undefined");
      return;
    }
    this.notifier.send(data.template, to);
    this.logger.log("template sended");
  }
}

const notiffycationInstace = new NotifficationFacade();
notiffycationInstace.send("test@sf.com", "other");

// Adapter

class KVDatabase {
  private db: Map<string, string> = new Map();
  save(key: string, value: string) {
    this.db.set(key, value);
  }
}
class PersistentDb {
  savePersistent(data: Object) {
    console.log(data);
  }
}
class PersistentDBAdapter extends KVDatabase {
  constructor(public database: PersistentDb) {
    super();
  }
  override save(key: string, value: string): void {
    this.database.savePersistent({ key, value });
  }
}

function run(base: KVDatabase) {
  base.save("key", "myValue");
}

run(new PersistentDBAdapter(new PersistentDb()));

//Proxy

interface IPaymentDetail {
  id: number;
  sum: number;
}
interface IPaymentAPI {
  getPaymentDetails(id: number): IPaymentDetail | undefined;
}
class PaymentAPI implements IPaymentAPI {
  private data = [{ id: 1, sum: 1000 }];
  getPaymentDetails(id: number): IPaymentDetail | undefined {
    return this.data.find((d) => d.id === id);
  }
}

class PaymentAccessProxy implements IPaymentAPI {
  constructor(private api: PaymentAPI, private userId: number) {}
  getPaymentDetails(id: number): IPaymentDetail | undefined {
    if (this.userId === 1) {
      return this.api.getPaymentDetails(id);
    }
    console.log("attempt to get payment data!");
    return undefined;
  }
}

const proxy = new PaymentAccessProxy(new PaymentAPI(), 1);
console.log(proxy.getPaymentDetails(1));

const proxyError = new PaymentAccessProxy(new PaymentAPI(), 2);
console.log(proxyError.getPaymentDetails(1));

//Composite

abstract class DeliveryItem {
  items: DeliveryItem[] = [];

  addItem(item: DeliveryItem) {
    this.items.push(item);
  }
  getItemPrice(): number {
    return this.items.reduce(
      (acc: number, i: DeliveryItem) => (acc += i.getPrice()),
      0
    );
  }
  abstract getPrice(): number;
}

export class DeliveryShop extends DeliveryItem {
  constructor(private deliveryFee: number) {
    super();
  }
  getPrice(): number {
    return this.getItemPrice() + this.deliveryFee;
  }
}

export class Package extends DeliveryItem {
  getPrice(): number {
    return this.getItemPrice();
  }
}

class Product extends DeliveryItem {
  constructor(private price: number) {
    super();
  }

  getPrice(): number {
    return this.price;
  }
}

const shop = new DeliveryShop(100);
shop.addItem(new Product(1955));

const pack1 = new Package();
pack1.addItem(new Product(10));
pack1.addItem(new Product(1450));
shop.addItem(pack1);

const pack2 = new Package();
pack2.addItem(new Product(150));
shop.addItem(pack2);
console.log(shop.getItemPrice());
