"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyClass = exports.UserService = void 0;
require("reflect-metadata");
const POSITIVE_METADATE_KEY = Symbol("POSITIVE_METADATE_KEY");
let UserService = class UserService {
    constructor() {
        // @Max(100)
        this._users = 1000;
    }
    set users(num) {
        this._users = num;
    }
    get users() {
        return this._users;
    }
    getUsersInDatabase() {
        console.log(num);
        throw new Error("Error");
    }
    setUsersInDatabase(num) {
        this._users = num;
    }
};
exports.UserService = UserService;
__decorate([
    LogAccessor(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], UserService.prototype, "users", null);
__decorate([
    LogMethod(),
    CatchError({ rethrow: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Number)
], UserService.prototype, "getUsersInDatabase", null);
__decorate([
    Validate(),
    __param(0, Positive()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserService.prototype, "setUsersInDatabase", null);
exports.UserService = UserService = __decorate([
    NullUser,
    SetUsers(2),
    Log(),
    SetUserAdvanced(34),
    NullUserAdvanced,
    CreatedAt
], UserService);
function Log() {
    console.log("log init");
    return (target) => {
        console.log("log run");
    };
}
function NullUser(target) {
    target.prototype.users = 0;
}
function LogUser(obj) {
    console.log("Users: " + obj.users);
    return obj;
}
function NullUserAdvanced(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.users = 3;
        }
    };
}
function SetUserAdvanced(users) {
    return (constructor) => {
        return class extends constructor {
            constructor() {
                super(...arguments);
                this.users = users;
            }
        };
    };
}
// console.log(nullUser(new UserService()).getUsersInDatabase());
// console.log(logUser(nullUser(new UserService())).getUsersInDatabase());
//decorator factory
function SetUsers(users) {
    console.log("setUsers init");
    return (target) => {
        console.log("setUsers run");
        target.prototype.users = users;
    };
}
function CreatedAt(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.createdAt = new Date();
        }
    };
}
//methods decorator
function LogMethod() {
    return (target, propsKey, descriptor) => {
        descriptor.value = () => {
            const oldMethod = descriptor.value;
            console.log("No Error");
            oldMethod;
        };
    };
}
function CatchError({ rethrow } = { rethrow: false }) {
    return (target, propsKey, descriptor) => {
        const method = descriptor.value;
        descriptor.value = (...args) => {
            try {
                console.log(target, args);
                return method === null || method === void 0 ? void 0 : method.apply(target, args);
            }
            catch (e) {
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
function Max(max) {
    return (target, propsKey) => {
        let value;
        const setter = function (newValue) {
            if (newValue > max) {
                console.log(`You can't set value more than ${max}`);
            }
            else {
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
    return (target, propsKey, descriptor) => {
        const set = descriptor.set;
        descriptor.set = (...args) => {
            console.log(args);
            set === null || set === void 0 ? void 0 : set.apply(target, args);
        };
    };
}
//parameter decorator and metadata
function Positive() {
    return (target, propsKey, parameterIndex) => {
        console.log(Reflect.getOwnMetadata("design:type", target, propsKey));
        console.log(Reflect.getOwnMetadata("design:paramtypes", target, propsKey));
        console.log(Reflect.getOwnMetadata("design:returntype", target, propsKey));
        let existParams = Reflect.getMetadata(POSITIVE_METADATE_KEY, target, propsKey) || [];
        existParams.push(parameterIndex);
        Reflect.defineMetadata(POSITIVE_METADATE_KEY, target, propsKey);
    };
}
function Validate() {
    return (target, propsKey, descriptor) => {
        let method = descriptor.value;
        descriptor.value = function (...args) {
            let positiveParams = Reflect.getMetadata(POSITIVE_METADATE_KEY, target, propsKey);
            if (positiveParams) {
                for (let i of positiveParams) {
                    if (args[i] < 0) {
                        throw new Error("Number should be more then 0");
                    }
                }
            }
            return method === null || method === void 0 ? void 0 : method.apply(this, args);
        };
    };
}
//decorator order
function Uni(name) {
    console.log(`init ${name}`);
    return function () {
        console.log(`call ${name}`);
    };
}
let MyClass = class MyClass {
    method(_) { }
    static method(_) { }
    constructor(_) { }
};
exports.MyClass = MyClass;
__decorate([
    Uni('Property'),
    __metadata("design:type", Object)
], MyClass.prototype, "prop", void 0);
__decorate([
    Uni("Method"),
    __param(0, Uni("params method")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyClass.prototype, "method", null);
__decorate([
    Uni('Static property'),
    __metadata("design:type", Object)
], MyClass, "prop2", void 0);
__decorate([
    Uni("Method static"),
    __param(0, Uni("params method static")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MyClass, "method", null);
exports.MyClass = MyClass = __decorate([
    Uni("Class"),
    __param(0, Uni("params construstor")),
    __metadata("design:paramtypes", [Object])
], MyClass);
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
