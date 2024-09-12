import { _decorator, CCFloat, Component, director, game, Node } from "cc";

const {property} = _decorator;

/**
 * Persistent Regulator singleton, will destroy any other older components of the same type it finds on awake
 */
export class RegulatorSingleton<T extends Component> extends Component {
    protected static instance: Component;

    public static get HasInstance(): boolean {
        return this.instance != null;
    }

    // private _initializationTime: number;
    //
    // @property(CCFloat)
    // public get InitializationTime() {
    //     return this._initializationTime;
    // };
    //
    // private set InitializationTime(value: number) {
    //     this._initializationTime = value;
    // }

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
        director.addPersistRootNode(this.node);

        if (RegulatorSingleton.HasInstance) {
            RegulatorSingleton.Instance().node.destroy();
        }

        RegulatorSingleton.instance = this;
    }
}