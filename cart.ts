class Product {
  constructor(public id: number, public title: string, public price: number) {}
}
class Delivery {
  constructor(public date: Date) {}
}

class HomeDelivery extends Delivery {
  constructor(date: Date, public address: string) {
    super(date);
  }
}
class ShopDelivery extends Delivery {
  constructor(public shopId: string) {
    super(new Date());
  }
}
type DeliveryOptions = HomeDelivery | ShopDelivery;

class Cart {
  private products: Product[] = [];
  private delivery!: DeliveryOptions;

  public addProduct(product: Product): void {
    this.products.push(product);
  }

  public deleteProduct(productId: number): void {
    this.products.filter((p) => p.id !== productId);
  }

  public getSum(): number {
    return this.products
      .map((p: Product) => p.price)
      .reduce((p1: number, p2: number) => p1 + p2);
  }
  public setDelivery(delivery: DeliveryOptions) {
    this.delivery = delivery;
  }
  public checkOut() {
    if (this.products.length == 0) {
      throw new Error("There aren't any products in the cart");
    }
    if (!this.delivery) {
      throw new Error("There isn't any delivery");
    }
    return { sucess: true };
  }
}

const cart = new Cart();
cart.addProduct(new Product(1, "shirt", 100));
cart.addProduct(new Product(1, "skirt", 50));
cart.addProduct(new Product(1, "trousers", 50));
cart.setDelivery(new HomeDelivery(new Date(), "some address"));
console.log(cart.getSum());
