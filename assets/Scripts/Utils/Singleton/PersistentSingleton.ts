import { _decorator, Component, CCBoolean, Node, director } from "cc";

const {property} = _decorator;

export class PersistentSingleton<T extends Component> extends Component {
    @property(CCBoolean)
    public AutoUnparentOnAwake: boolean = true;

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
            director.addPersistRootNode(node);  // Ensure it persists across scenes
            this.instance = instance;
        }
        return this.instance as T;
    }

    protected onLoad() {
        this.InitializeSingleton();
    }

    protected InitializeSingleton(): void {
        if (!this.AutoUnparentOnAwake) return;

        this.node.setParent(director.getScene());

        if (!PersistentSingleton.instance) {
            PersistentSingleton.instance = this;
            director.addPersistRootNode(this.node);
        } else {
            if (PersistentSingleton.instance !== this) {
                this.node.destroy();
            }
        }
    }
}