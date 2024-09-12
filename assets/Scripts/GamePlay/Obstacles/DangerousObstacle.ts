import { _decorator, Component, Node, Collider2D, Contact2DType } from 'cc';
import { injectComponent } from "../../Utils/DI/Component.ts";
import { Player } from "../Player/Player.ts";

const {ccclass, property} = _decorator;

@ccclass('DangerousObstacle')
export class DangerousObstacle extends Component {
    @injectComponent(Collider2D)
    private collider: Collider2D;

    protected onLoad() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.OnBeginContact, this);
    }

    private OnBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.node.name != "Player") return;

        const player = otherCollider.getComponent(Player);
        player.Die();
    }
}


