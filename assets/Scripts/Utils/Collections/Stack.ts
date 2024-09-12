import { Collection } from "./Collection";
import { IStack } from "./IStack";

export class StackCollection<T> extends Collection<T> implements IStack<T> {
    constructor(private capacity: number = Infinity) {
        super();
    }

    push(item: T) {
        if (this.isFull()) {
            throw Error("Stack has reached max capacity, you cannot add more items");
        }
        // In the derived class, we can access protected properties of the abstract class
        this.storage.push(item);
    }

    pop(): T | undefined {
        return this.storage.pop();
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1];
    }

    // Implementation of the abstract method
    isFull(): boolean {
        return this.capacity === this.size();
    }
}
