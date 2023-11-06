type Constructor = new (...args: any[]) => {};
type GConstructor<T = {}> = new (...args: any[]) => T;

class List {
  constructor(public items: string[]) {}
}
class Accordion {
  isOpen!: boolean;
}

type ListType = GConstructor<List>;
type AccordionType = GConstructor<Accordion>;

class ExtendedListClass extends List {
  first() {
    return this.items[0];
  }
}

function ExtendedList<TBase extends ListType & AccordionType>(Base: TBase) {
  return class ExtendedList extends Base {
    first() {
      return this.items[0];
    }
  };
}
class AccordionList {
  isOpen!: boolean;
  constructor(public items: string[]) {}
}

const ClassAccordionList = ExtendedList(AccordionList);


const res3 = new ClassAccordionList(["one", "two"]);
