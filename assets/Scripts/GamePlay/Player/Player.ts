import {
    _decorator,
    CCFloat,
    Collider2D,
    Component,
    Contact2DType,
    input,
    Input,
    RigidBody2D, Sprite,
    Vec2,
    Vec3
} from 'cc';
import { injectComponent } from "../../Utils/DI/Component.ts";
import { EventBus } from "../../Utils/EventBus/EventBus.ts";
import { PlayerDie } from "../../Core/EventTypes/PlayerDie.ts";
import { filter, Observable, Subject } from "@iskl/rxjs-bundle";

const {ccclass, property} = _decorator;

@ccclass('Player')
export class Player extends Component {
    //region Variables
    @property(CCFloat)
    private movingSpeed: number;

    @injectComponent(RigidBody2D)
    private rb: RigidBody2D;

    @injectComponent(Collider2D)
    private collider: Collider2D;

    private isMovingForward: boolean = false;

    private inputEventSubject: Subject<unknown> = new Subject();
    public inputEventObservable$: Observable<unknown>;

    //endregion

    //region Life Cycle Methods
    protected onLoad() {
        this.inputEventObservable$ = this.inputEventSubject.pipe(
            filter(() => this.isMovingForward == false)
        );

        input.on(Input.EventType.TOUCH_START, this.OnTouchStart, this);


        this.collider.on(Contact2DType.BEGIN_CONTACT, this.OnBeginContact, this);
    }

    protected onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.OnTouchStart, this);
        this.inputEventSubject.complete();
    }

    //endregion

    private OnTouchStart() {
        this.inputEventSubject.next(null);
    }

    public Move(direction: Vec3) {
        this.isMovingForward = true;

        this.rb.applyForceToCenter(
            new Vec2(direction.x, direction.y).multiplyScalar(this.movingSpeed),
            true
        );
    }

    public Die() {
        this.inputEventSubject.complete();
        this.node.getComponent(Sprite).spriteFrame = null;

        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.1);

        EventBus.Raise<PlayerDie>(new PlayerDie());
    }

    private OnBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        this.rb.linearVelocity = Vec2.ZERO;

        this.isMovingForward = false;
    }
}


