import {
    _decorator,
    Canvas,
    Input,
    input,
    instantiate,
    Prefab,
    Node, director, game
} from 'cc';
import { PersistentSingleton } from "../Utils/Singleton/PersistentSingleton.ts";
import { EventBinding } from "../Utils/EventBus/EventBinding.ts";
import { PlayerDie } from "../Core/EventTypes/PlayerDie.ts";
import { EventBus } from "../Utils/EventBus/EventBus.ts";

const {ccclass, property} = _decorator;

@ccclass('GameManager')
export class GameManager extends PersistentSingleton<GameManager> {
    @property(Prefab)
    private levelPrefab: Prefab;

    @property(Node)
    private tapToPlay: Node;

    private currentLevel: Node;

    private playerDieEventBinding: EventBinding<PlayerDie>;

    protected onLoad() {
        super.onLoad();

        input.once(Input.EventType.TOUCH_START, () => {
            this.InitLevel();
        });

        this.playerDieEventBinding = new EventBinding<PlayerDie>(PlayerDie.name, this.HandlePlayerDieEvent.bind(this));

        EventBus.Register<PlayerDie>(this.playerDieEventBinding);
    }

    private InitLevel() {
        this.currentLevel = instantiate(this.levelPrefab);
        this.currentLevel.setParent(this.node.scene.getComponentInChildren(Canvas).node);

        this.tapToPlay.active = false;
    }

    private HandlePlayerDieEvent() {
        input.once(Input.EventType.TOUCH_START, () => {
            this.currentLevel.destroy();

            this.InitLevel();
        });

    }
}


