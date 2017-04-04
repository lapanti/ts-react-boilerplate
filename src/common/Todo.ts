/**
 * To ensure that we don't link different components together
 * we create "shared" classes in a separate classes-folder, such
 * as this Todo-class, which is required by multiple components
 */
export default class Todo {
    constructor(number: number, title: string, done?: boolean) {
        this.number = number;
        this.title = title;
        this.done = done || false;
    }
    readonly number: number;
    readonly title: string;
    readonly done: boolean;

    setDone = (): Todo => new Todo(this.number, this.title, true);
}
