import { Collection } from "./Collection";
import { IQueue } from "./IQueue";

export class QueueCollection<T> extends Collection<T> implements IQueue<T> {
    constructor(private capacity: number = Infinity) {
        super();
    }

    enqueue(item: T): void {
        if (this.isFull()) {
            throw Error("Queue has reached max capacity, you cannot add more items");
        }
        // In the derived class, we can access protected properties of the abstract class
        this.storage.push(item);
    }
    dequeue(): T | undefined {
        return this.storage.shift();
    }

    peek(): T {
        return this.storage[0];
    }

    // Implementation of the abstract method
    isFull(): boolean {
        return this.capacity === this.size();
    }
}