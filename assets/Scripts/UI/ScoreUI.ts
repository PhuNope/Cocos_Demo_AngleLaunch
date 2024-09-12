import { _decorator, Component, Node, Animation, Label } from 'cc';
import { injectComponent } from "../Utils/DI/Component.ts";

const {ccclass, property} = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {
    @injectComponent(Animation)
    private animation: Animation;

    @injectComponent(Label)
    private scoreLabel: Label;

    public SetScore(score: number) {
        this.scoreLabel.string = score.toString();

        this.animation.play();
    }
}


