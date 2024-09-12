import { _decorator, Component, math, Vec3, Node } from 'cc';
import { RoundedObstacle } from "../Obstacles/RoundedObstacle.ts";
import { Player } from "../Player/Player.ts";
import {
    asapScheduler,
    first,
    scheduled,
    Subscription,
} from "@iskl/rxjs-bundle";
import { ScoreUI } from "../../UI/ScoreUI.ts";
import { EventBinding } from "../../Utils/EventBus/EventBinding.ts";
import { PlayerDie } from "../../Core/EventTypes/PlayerDie.ts";
import { EventBus } from "../../Utils/EventBus/EventBus.ts";

const {ccclass, property} = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {

    //region Variables
    @property(Player)
    private player: Player;

    @property([RoundedObstacle])
    private roundedObstacles: RoundedObstacle[];

    @property(ScoreUI)
    private scoreUI: ScoreUI;

    @property(Node)
    private replayUINode: Node;

    private handleInputEventObservable_Player: Subscription;

    private score: number = 0;

    private playerDieEventBinding: EventBinding<PlayerDie>;
    //endregion

    //region Life Cycle Methods
    protected onLoad() {
        RoundedObstacle.OnHitCorrect.Add(this.RoundedObstacle_OnHitCorrect, this);

        this.playerDieEventBinding = new EventBinding(PlayerDie.name, this.HandlePlayerDieEvent.bind(this));

        EventBus.Register<PlayerDie>(this.playerDieEventBinding);
    }

    protected start() {
        this.handleInputEventObservable_Player = this.player.inputEventObservable$
            .subscribe(() => {
                this.OnPlayerClick();
            });

        this.SetUp();
    }

    protected onDestroy() {
        this.handleInputEventObservable_Player.unsubscribe();
        RoundedObstacle.OnHitCorrect.DeleteEvent(this.RoundedObstacle_OnHitCorrect, this);
        EventBus.Deregister<PlayerDie>(this.playerDieEventBinding);
    }

    //endregion

    private HandlePlayerDieEvent() {
        this.replayUINode.active = true;
    }

    private OnPlayerClick() {
        scheduled(this.roundedObstacles, asapScheduler)
            .pipe(
                first(roundedObstacle => roundedObstacle.IsHolding)
            )
            .subscribe(roundedObstacle => {
                roundedObstacle.SetRotateAround(null);

                const direction: Vec3 = new Vec3();
                Vec3.subtract(direction, this.player.node.worldPosition, roundedObstacle.node.worldPosition);
                this.player.Move(direction.normalize());
            });
    }

    private SetUp() {
        this.roundedObstacles.forEach(obs => obs.IsDisable = true);

        const obstacle = this.GetRandomRoundedObstacleDisable();

        let dir = new Vec3();
        Vec3.subtract(dir, this.player.node.worldPosition, obstacle.node.worldPosition);
        dir.normalize();

        Vec3.add(this.player.node.worldPosition, obstacle.node.worldPosition, dir.multiplyScalar(obstacle.rotateRadius));

        obstacle.IsHolding = true;
        obstacle.SetRotateAround(this.player.node, this.score);

        this.SetNextRoundedObstacle();
    }

    private GetRandomRoundedObstacleDisable(): RoundedObstacle {
        let obstacle: RoundedObstacle;

        let disableObstacles = this.roundedObstacles
            .filter(roundedObstacle => roundedObstacle.IsDisable);

        obstacle = disableObstacles[math.randomRangeInt(0, disableObstacles.length)];

        // scheduled(this.roundedObstacles, asapScheduler)
        //     .pipe(
        //         filter(roundedObstacle => roundedObstacle.IsDisable),
        //         toArray(),
        //         map(disableObstacles => disableObstacles[math.randomRangeInt(0, disableObstacles.length)])
        //     )
        //     .subscribe(roundedObstacle => {
        //         console.log("random: ", roundedObstacle);
        //         obstacle = roundedObstacle;
        //     });

        return obstacle;
    }

    private SetNextRoundedObstacle() {
        this.GetRandomRoundedObstacleDisable().IsEnable = true;
    }

    //region Event Handler

    private RoundedObstacle_OnHitCorrect(roundedObstacle: RoundedObstacle) {
        scheduled(this.roundedObstacles, asapScheduler)
            .pipe(
                first(roundedObstacle => roundedObstacle.IsHolding),
            )
            .subscribe(previousObstacle => {
                this.SetNextRoundedObstacle();

                previousObstacle.IsDisable = true;

                // add score
                this.score++;
                this.scoreUI.SetScore(this.score);

                roundedObstacle.IsHolding = true;
                roundedObstacle.SetRotateAround(this.player.node, this.score);
            });
    }

    //endregion
}


