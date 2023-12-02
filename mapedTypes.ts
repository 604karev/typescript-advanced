type Modifier = "read" | "update" | "create";
//come fron back-end
type UserRole = {
  custom?: Modifier;
  projects?: Modifier;
  adminPanel?: Modifier;
};
//we need that structure on front-end
type UserAccess = {
  customer?: boolean;
  projects?: boolean;
  adminPanel?: boolean;
};

type ModifierToAccess<T> = {
  +readonly [Props in keyof T as Exclude<
    `CanAccess${string & Props}`,
    "CanAccessadminPanel"
  >]-?: boolean;
};

type UserModifierToAccess = ModifierToAccess<UserRole>;

interface IForm {
  name: string;
  password: string;
}

const form: IForm = {
  name: "Dan",
  password: "123",
};

type FormToFormValidation<T> = {
  [Props in keyof T]:
    | { isValid: true }
    | { isValid: false; errorMessage: string };
};

const formValidation: FormToFormValidation<IForm> = {
  name: { isValid: true },
  password: { isValid: false, errorMessage: "Should be longer than 5 symbold" },
};
