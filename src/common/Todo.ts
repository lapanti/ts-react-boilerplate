export default class Todo {
    constructor(id: number, title: string, done?: boolean) {
        this.id = id;
        this.title = title;
        this.done = done || false;
    }
    readonly id: number;
    readonly title: string;
    readonly done: boolean;

    setDone = (): Todo => new Todo(this.id, this.title, true);
}
