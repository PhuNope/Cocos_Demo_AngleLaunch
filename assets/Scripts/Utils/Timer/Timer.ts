import { CocosEvent } from "../CocosEvent/CocosEvent";

export namespace Timer {
    abstract class Timer {
        protected initialTime: number;
        private _time: number;

        public get Time(): number {
            return this._time;
        }

        protected set Time(value: number) {
            this._time = value;
        }

        private _isRunning: boolean;

        public get IsRunning(): boolean {
            return this._isRunning;
        }

        protected set IsRunning(value: boolean) {
            this._isRunning = value;
        }

        public get Progress() {
            return this._time / this.initialTime;
        }

        public OnTimerStart: CocosEvent<() => void> = new CocosEvent();
        public OnTimerStop: CocosEvent<() => void> = new CocosEvent();

        constructor(value: number) {
            this.initialTime = value;
            this.IsRunning = false;
        }

        public Start(): void {
            this._time = this.initialTime;
            if (!this.IsRunning) {
                this.IsRunning = true;
                this.OnTimerStart.Invoke();
            }
        }

        public Stop(): void {
            if (this.IsRunning) {
                this.IsRunning = false;
                this.OnTimerStop.Invoke();
            }
        }

        public Resume() {
            this.IsRunning = true;
        }

        public Pause(): void {
            this.IsRunning = false;
        }

        public abstract Tick(deltaTime: number): void;
    }

    export class CountDownTimer extends Timer {
        public OnTimerProgress: CocosEvent<() => void> = new CocosEvent();

        public override Tick(deltaTime: number): void {
            if (this.IsRunning && this.Time > 0) {
                this.Time -= deltaTime;

                this.OnTimerProgress.Invoke();
            }

            if (this.IsRunning && this.Time <= 0) {
                this.Stop();
            }
        }

        public IsFinished(): boolean {
            return this.Time <= 0;
        }

        public Reset(): void;
        public Reset(newTime?: number): void {
            if (!isNaN(newTime)) {
                this.initialTime = newTime;
            }

            this.Time = this.initialTime;
        }
    }
}
