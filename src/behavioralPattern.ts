//Chain of command
interface IMiddleware {
  next(mid: IMiddleware): IMiddleware;
  handle(request: any): any;
}

abstract class AbsrtactMiddleware implements IMiddleware {
  private nextMiddleware: IMiddleware;
  next(mid: IMiddleware): IMiddleware {
    this.nextMiddleware = mid;
    return mid;
  }
  handle(request: any) {
    if (this.nextMiddleware) {
      return this.nextMiddleware.handle(request);
    }
    return;
  }
}

class AuthMiddleware extends AbsrtactMiddleware {
  override handle(request: any) {
    console.log("AuthMiddleware");
    if (request.userId == 1) {
      return super.handle(request);
    }
    return { error: "You're not authoresed" };
  }
}

class ValidateMiddleware extends AbsrtactMiddleware {
  override handle(request: any) {
    console.log("ValidateMiddleware");
    if (request.body) {
      return super.handle(request);
    }
    return { error: "Don't have body" };
  }
}

export class Controller extends AbsrtactMiddleware {
  override handle(request: any) {
    console.log("Controller");

    return { success: request };
  }
}

const controller = new Controller();
const validate = new ValidateMiddleware();
const auth = new AuthMiddleware();

auth.next(validate).next(controller);

console.log(auth.handle({ userId: 3 }));
console.log(auth.handle({ userId: 1 }));
console.log(auth.handle({ userId: 1, body: "I am body" }));

//Mediator

interface IMediator {
  notify(sender: string, event: string): void;
}
abstract class Mediated {
  mediator: IMediator;
  setMediator(mediator: IMediator) {
    this.mediator = mediator;
  }
}

class Notifications {
  send() {
    console.log("Sending notification");
  }
}

class Log {
  log(message: string) {
    console.log(message);
  }
}

class EventHandler extends Mediated {
  myEvent() {
    this.mediator.notify("EventHandler", "myEvent");
  }
}

class NotifficationMediator implements IMediator {
  constructor(
    public notifications: Notifications,
    public logger: Log,
    public handler: EventHandler
  ) {}

  notify(sender: string, event: string): void {
    switch (event) {
      case "myEvent":
        this.notifications.send();
        this.logger.log("send");
        break;
    }
  }
}

const handler = new EventHandler();
const logger = new Log();
const notifications = new Notifications();

const m = new NotifficationMediator(notifications, logger, handler);

handler.setMediator(m);
handler.myEvent();

//Command

class User {
  constructor(public userId: number) {}
}

class CommandHistory {
  public commands: Command[] = [];
  push(command: Command) {
    this.commands.push(command);
  }
  remove(command: Command) {
    this.commands = this.commands.filter(
      (c) => c.commandId !== command.commandId
    );
  }
}

abstract class Command {
  public commandId: number;

  abstract execute(): void;

  constructor(public history: CommandHistory) {
    this.commandId = Math.random();
  }
}

class AddUserCommand extends Command {
  constructor(
    private user: User,
    private receiver: UserService,
    history: CommandHistory
  ) {
    super(history);
  }
  execute(): void {
    this.receiver.saveUser(this.user);
    this.history.push(this);
  }
  undo() {
    this.receiver.deleteUser(this.user.userId);
    this.history.remove(this);
  }
}

class UserService {
  saveUser(user: User) {
    console.log(`Save user with id ${user.userId}`);
  }
  deleteUser(userId: number) {
    console.log(`Delete user with id ${userId}`);
  }
}

export class UserServiceController {
  receiver: UserService;
  history: CommandHistory = new CommandHistory();
  addReceiver(receiver: UserService) {
    this.receiver = receiver;
  }
  run() {
    const addUserCommand = new AddUserCommand(
      new User(1),
      this.receiver,
      this.history
    );
    addUserCommand.execute();
    console.log(addUserCommand.history);
    addUserCommand.undo();
    console.log(addUserCommand.history);
  }
}

const userServiceController = new UserServiceController();
userServiceController.addReceiver(new UserService());
userServiceController.run();

//State

class DocumentItem {
  public text: string;
  private state: DocumentItemState;
  constructor() {
    this.setState(new DraftDocumentItmeState());
  }

  getState() {
    return this.state;
  }

  setState(state: DocumentItemState) {
    this.state = state;
    this.state.setContex(this);
  }

  publishDoc() {
    this.state.publish();
  }

  deleteDoc() {
    this.state.deleve();
  }
}

abstract class DocumentItemState {
  public name: string;
  public item: DocumentItem;

  public setContex(item: DocumentItem) {
    this.item = this.item;
  }
  public abstract publish(): void;
  public abstract deleve(): void;
}

class DraftDocumentItmeState extends DocumentItemState {
  constructor() {
    super();
    this.name = "DraftDocument";
  }
  public publish(): void {
    console.log(`Text was sent`);
    this.item.setState(new PublishDocumentItmeState());
  }
  public deleve(): void {
    console.log("Document deleted");
  }
}

class PublishDocumentItmeState extends DocumentItemState {
  constructor() {
    super();
    this.name = "PublishDocument";
  }
  public publish(): void {
    console.log("You can't publish publisheddocument");
  }
  public deleve(): void {
    throw new Error("remove from published");
    this.item.setState(new DraftDocumentItmeState());
  }
}

const item = new DocumentItem();
item.text = "My blog post";
console.log(item.getState());
item.publishDoc();
console.log(item.getState());
item.deleteDoc();
console.log(item.getState());
