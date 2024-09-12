import { _decorator, Component, Node } from "cc";

const {property} = _decorator;

export class Singleton<T extends Component> extends Component {

    protected static instance: Component;

    public static get HasInstance(): boolean {
        return this.instance != null;
    }

    public static TryGetInstance<T extends Component>(): T | null {
        return this.HasInstance ? this.instance as T : null;
    }

    public static Instance<T extends Component>(): T {
        if (!this.instance) {
            const node = new Node(this.name + ' Auto-Generated');
            const instance = node.addComponent(this);
            this.instance = instance;
        }
        return this.instance as T;
    }

    protected onLoad() {
        this.InitializeSingleton();
    }

    protected InitializeSingleton(): void {
        Singleton.instance = this;
    }
}