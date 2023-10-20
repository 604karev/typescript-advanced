let info: {
  officeId: number;
  isOpened: boolean;
  contacts: {
    phone: string;
    email: string;
    adress: {
      city: string;
    };
  };
};

enum PaymentStatus {
  SUCCESS = "success",
  FAILED = "failed",
}

interface IPayment {
  sum: number;
  from: number;
  to: number;
}
interface IPaymentRequest extends IPayment {}

interface IDataSuccess extends IPayment {
  databaseId: number;
}

interface IDataFailed {
  errorMessage: string;
  errorCode: number;
}

interface IResponseSuccess {
  status: PaymentStatus.SUCCESS;
  data: IDataSuccess;
}

interface IResponseFailed {
  status: PaymentStatus.FAILED;
  data: IDataFailed;
}

function getData(
  paymentData: IPaymentRequest
): IResponseFailed | IResponseSuccess {
  return {
    status: "success",
    data: {
      databaseId: 567,
      sum: 10000,
      from: 2,
      to: 4,
    },
  } as IResponseSuccess;
}

interface User {
  name: string;
  email: string;
  login: string;
}

const user: User = {
  name: "RR",
  email: "rr@rr.com",
  login: "kk",
};

interface Admin {
  name: string;
  role: number;
}

function typeMapping(user: User): Admin {
  return {
    name: user.name,
    role: 1,
  };
}

function isString(x: string | number): x is string {
  return typeof x === "string";
}

function logIn(id: string | number) {
  if (isString(id)) {
    console.log(id);
  } else {
    console.log(id);
  }
}
