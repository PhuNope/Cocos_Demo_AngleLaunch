import { IEventBinding } from "./EventBinding";
import { IEvent } from "./Events";

export class EventBus<T extends IEvent> {
    private static bindings = new Map<string, Set<IEventBinding<any>>>();

    public static Register<T>(binding: IEventBinding<T>): void {
        const eventName = binding.eventName;
        if (!this.bindings.has(eventName)) {
            this.bindings.set(eventName, new Set<IEventBinding<T>>());
        }
        this.bindings.get(eventName)?.add(binding);
    }

    public static Deregister<T>(binding: IEventBinding<T>): void {
        const eventName = binding.eventName;
        this.bindings.get(eventName)?.delete(binding);
    }

    public static Raise<T>(event: T): void {
        const eventName = event.constructor.name;
        const bindings = this.bindings.get(eventName);
        if (bindings) {``
            for (const binding of bindings) {
                (binding.onEvent as (event: T) => void)?.(event);
                binding.onEventNoArgs?.();
            }
        }
    }

    public static Clear(): void {
        console.log(`Clearing bindings`);
        this.bindings.clear();
    }
}