import {
    _decorator,
    CCBoolean,
    CCFloat, Collider2D,
    Color,
    Component, Contact2DType, game,
    Node, sp,
    Sprite,
    Vec2,
    Vec3
} from 'cc';
import { injectComponent } from "../../Utils/DI/Component.ts";
import { Player } from "../Player/Player.ts";
import { CocosEvent } from "../../Utils/CocosEvent/CocosEvent.ts";

const {ccclass, property} = _decorator;

@ccclass('RoundedObstacle')
export class RoundedObstacle extends Component {
    //region Variables
    public static OnHitCorrect: CocosEvent<(roundedObstacle: RoundedObstacle) => void> = new CocosEvent();

    @property(CCFloat)
    public rotateRadius: number;

    @property(Color)
    private colorEnable: Color = new Color();

    @property(Color)
    private colorHolding: Color = new Color();

    @property(Color)
    private colorDisable: Color = new Color();

    @injectComponent(Sprite)
    private spriteComp: Sprite;

    @injectComponent(Collider2D)
    private collider: Collider2D;

    private _isEnable: boolean = false;

    public set IsEnable(value: boolean) {
        this._isEnable = value;

        if (this._isEnable) {
            this._isHolding = false;
            this._isDisable = false;

            this.spriteComp.color = this.colorEnable;
        }
    }

    @property(CCBoolean)
    public get IsEnable() {
        return this._isEnable;
    }

    private _isHolding: boolean = false;

    public set IsHolding(value: boolean) {
        this._isHolding = value;

        if (this._isHolding) {
            this._isEnable = false;
            this._isDisable = false;

            this.spriteComp.color = this.colorHolding;
        }
    }

    @property(CCBoolean)
    public get IsHolding() {
        return this._isHolding;
    }

    private _isDisable: boolean = false;

    public set IsDisable(value: boolean) {
        this._isDisable = value;

        if (this._isDisable) {
            this._isEnable = false;
            this._isHolding = false;

            this.spriteComp.color = this.colorDisable;
        }
    }

    @property(CCBoolean)
    public get IsDisable() {
        return this._isDisable;
    }

    private objectRotatedAround: Node;

    private signRotateAround: number;

    @property(CCFloat)
    private speedToRadius: number;

    @property(CCFloat)
    private speedRotateAround: number;

    @property(CCFloat)
    public speedRotateFactor: number;

    private score: number = 0;

    //endregion

    //region Life Cycle Methods

    protected onLoad() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.OnBeginContact, this);
    }

    protected update(dt: number) {
        this.HandleRotateAroundObject();
    }

    protected onDestroy() {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.OnBeginContact, this);
    }

    //endregion

    public SetRotateAround(node: Node, score?: number) {
        this.objectRotatedAround = node;

        if (this.objectRotatedAround) {
            let sign = Math.sign(this.node.worldPosition.x - node.worldPosition.x);
            this.signRotateAround = sign == 0 ? 1 : sign;

            this.score = score ?? 0;
        }
    }

    private HandleRotateAroundObject() {
        if (!this.objectRotatedAround) return;

        // move object to radius
        let dir: Vec3 = new Vec3();
        Vec3.subtract(dir, this.objectRotatedAround.worldPosition, this.node.worldPosition);
        dir.normalize();

        let targetPos: Vec3 = new Vec3();

        let targetRadiusPos: Vec3 = new Vec3();
        Vec3.add(targetRadiusPos, this.node.worldPosition, dir.multiplyScalar(this.rotateRadius));

        Vec3.lerp(targetPos, this.objectRotatedAround.worldPosition, targetRadiusPos, game.deltaTime * this.speedToRadius);

        // rotate around
        dir.normalize();
        Vec3.rotateZ(
            targetPos, targetPos, this.node.worldPosition,
            (this.speedRotateAround + this.speedRotateFactor * this.score) * game.deltaTime * this.signRotateAround
        );

        this.objectRotatedAround.worldPosition = targetPos;
    }

    private OnBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.node.name != "Player") return;

        let player: Player = otherCollider.getComponent(Player);

        if (this.IsDisable) {
            player.Die();

            return;
        }

        if (this.IsEnable) {
            RoundedObstacle.OnHitCorrect.Invoke(this);
            return;
        }
    }
}


