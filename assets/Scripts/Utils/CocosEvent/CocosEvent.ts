import { EventTarget } from "cc";

export class CocosEvent<TCallback extends (...args: any[]) => any = () => void> {
    private _eventTarget = new EventTarget();

    public readonly Add = (callback: TCallback, thisArg: any) => {
        this._eventTarget.on('', callback, thisArg);
    };

    public readonly DeleteEvent = (callback: TCallback, thisArg: any) => {
        this._eventTarget.off('', callback, thisArg);
    };

    public readonly Invoke = (...args: Parameters<TCallback>) => {
        this._eventTarget.emit('', ...args);
    };
}


