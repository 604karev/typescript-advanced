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
    this.state.delete();
  }
}

abstract class DocumentItemState {
  public name: string;
  public item: DocumentItem;

  public setContex(item: DocumentItem) {
    this.item = this.item;
  }
  public abstract publish(): void;
  public abstract delete(): void;
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
  public delete(): void {
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
  public delete(): void {
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

//Strategy

class AuthUser {
  githubToken: string;
  jwtToken: string;
}

interface IAuthStrategy {
  auth(user: AuthUser): boolean;
}

class Auth {
  constructor(private strategy: IAuthStrategy) {
    // this.setStrategy(strategy);
  }

  setStrategy(strategy: IAuthStrategy) {
    this.strategy = strategy;
  }

  public authUser(user: AuthUser): boolean {
    return this.strategy.auth(user);
  }
}

class JWTStrategy implements IAuthStrategy {
  auth(user: AuthUser): boolean {
    if (user.jwtToken) {
      return true;
    }
    return false;
  }
}

class GithubStrategy implements IAuthStrategy {
  auth(user: AuthUser): boolean {
    if (user.githubToken) {
      return true;
    }
    return false;
  }
}

const authUser = new AuthUser();
authUser.jwtToken = "toket";
const authStrategy = new Auth(new JWTStrategy());
console.log(authStrategy.authUser(authUser));
authStrategy.setStrategy(new GithubStrategy());
console.log(authStrategy.authUser(authUser));

//Iterator

interface IIterator<T> {
  current(): T | undefined;
  next(): T | undefined;
  prev(): T | undefined;
  index(): number;
}

class PriorityIterator implements IIterator<Task> {
  private position: number = 0;
  private taskList: TaskList;
  constructor(taskList: TaskList) {
    taskList.sortByPriority();
    this.taskList = taskList;
  }
  current(): Task | undefined {
    return this.taskList.getTasks()[this.position];
  }
  next(): Task | undefined {
    this.position += 1;
    return this.taskList.getTasks()[this.position];
  }
  prev(): Task | undefined {
    this.position -= 1;
    return this.taskList.getTasks()[this.position];
  }

  index(): number {
    return this.position;
  }
}

class Task {
  constructor(public priority: number) {}
}

class TaskList {
  private tasks: Task[] = [];

  public sortByPriority() {
    this.tasks = this.tasks.sort((a, b) => {
      if (a.priority > b.priority) {
        return 1;
      } else if (a.priority == b.priority) {
        return 0;
      } else {
        return -1;
      }
    });
  }

  public addTask(task: Task) {
    this.tasks.push(task);
  }
  public getTasks() {
    return this.tasks;
  }
  public countTasks() {
    return this.tasks.length;
  }
  public getIterator() {
    return new PriorityIterator(this);
  }
}

const taskList = new TaskList();
taskList.addTask(new Task(8));
taskList.addTask(new Task(1));
taskList.addTask(new Task(3));
const iterator = taskList.getIterator();
console.log(iterator.current());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.prev());
console.log(iterator.index());

//Template Method

class Form {
  constructor(public name: string) {}
}

abstract class SaveForm<T> {
  public save(form: Form) {
    const res = this.fill(form);
    this.log(res);
    this.send(res);
  }

  protected abstract fill(form: Form): T;
  protected log(data: T): void {
    console.log(data);
  }

  protected abstract send(data: T): void;
}

class FirstAPI extends SaveForm<string> {
  protected fill(form: Form): string {
    return form.name;
  }
  protected send(data: string): void {
    console.log(`Send ${data}`);
  }
}

class SecondAPI extends SaveForm<{ fullName: string }> {
  protected fill(form: Form): { fullName: string } {
    return { fullName: form.name };
  }
  protected send(data: { fullName: string }): void {
    console.log(`Send ${data}`);
  }
}

const form1 = new FirstAPI();
form1.save(new Form("Dik"));

const form2 = new SecondAPI();
form2.save(new Form("Dik"));

//Observer

interface IObserver {
  update(subject: ISubject): void;
}
interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(): void;
}

class Lead {
  constructor(public name: string, public phone: string) {}
}

class NewLead implements ISubject {
  private observers: IObserver[] = [];
  public state: Lead;

  attach(observer: IObserver): void {
    if (this.observers.includes(observer)) {
      return;
    } else {
      this.observers.push(observer);
    }
  }
  detach(observer: IObserver): void {
    const oberverIndex = this.observers.indexOf(observer);
    if (oberverIndex === -1) {
      return;
    }
    this.observers.slice(oberverIndex, 1);
  }
  notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}

class NotificationService implements IObserver {
  update(subject: ISubject): void {
    console.log("NotificationService got notiffication");
    console.log(subject);
  }
}

class LeadService implements IObserver {
  update(subject: ISubject): void {
    console.log("LeadService got notiffication");
    console.log(subject);
  }
}

const subject = new NewLead();
subject.state = new Lead("Jack", "000");
const s1 = new NotificationService();
const s2 = new LeadService();
subject.attach(s1);
subject.attach(s2);
subject.notify();
subject.detach(s1)
subject.notify();