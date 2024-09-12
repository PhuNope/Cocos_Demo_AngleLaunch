import { IEvent } from "./Events";

export interface IEventBinding<T extends IEvent> {
    onEvent?: (event: T) => void;
    onEventNoArgs?: () => void;
    eventName: string;
}

export class EventBinding<T extends IEvent> implements IEventBinding<T> {
    public onEvent: (event: T) => void = () => {
    };
    public onEventNoArgs: () => void = () => {
    };

    public eventName: string;

    constructor(eventName: string, onEvent: (event: T) => void);
    constructor(eventName: string, onEventNoArgs?: () => void);
    constructor(eventName: string, onEventOrNoArgs?: ((event: T) => void) | (() => void)) {
        if (onEventOrNoArgs) {
            if (onEventOrNoArgs.length === 0) {
                this.onEventNoArgs = onEventOrNoArgs as () => void;
            } else {
                this.onEvent = onEventOrNoArgs as (event: T) => void;
            }
        }

        this.eventName = eventName;
    }

    public add(onEvent: () => void): void;
    public add(onEvent: (event: T) => void): void;
    public add(onEventOrNoArgs: ((event: T) => void) | (() => void)): void {
        if (onEventOrNoArgs.length === 0) {
            this.onEventNoArgs = onEventOrNoArgs as () => void;
        } else {
            this.onEvent = onEventOrNoArgs as (event: T) => void;
        }
    }

    public remove(onEvent: () => void): void;
    public remove(onEvent: (event: T) => void): void;
    public remove(onEventOrNoArgs: ((event: T) => void) | (() => void)): void {
        if (onEventOrNoArgs.length === 0) {
            this.onEventNoArgs = () => {
            };
        } else {
            this.onEvent = () => {
            };
        }
    }
}