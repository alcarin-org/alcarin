export type onTick = (deltaTimeSec: DOMHighResTimeStamp) => void;

export class Timer {
    private lastStepTimestamp = 0;
    private requestFrameId?: number;
    private handlers: onTick[] = [];

    public onTick(handler: onTick): () => void {
        this.handlers.push(handler);
        return () =>
            (this.handlers = this.handlers.filter(
                currHandler => currHandler !== handler
            ));
    }

    public start() {
        if (process.env.REACT_APP_DEBUG === '1') {
            if (this.requestFrameId !== undefined) {
                throw new Error('Tried to start already runned animation.');
            }
        }

        this.lastStepTimestamp = 0;
        this.requestFrameId = requestAnimationFrame(this.timerLoop);
    }

    public stop() {
        if (this.requestFrameId !== undefined) {
            cancelAnimationFrame(this.requestFrameId);
            this.requestFrameId = undefined;
        }
    }

    public get isRunning() {
        return this.requestFrameId !== undefined;
    }

    private timerLoop = (timestamp: DOMHighResTimeStamp) => {
        if (this.lastStepTimestamp) {
            const deltaTimeSec = (timestamp - this.lastStepTimestamp) / 1000;
            this.handlers.forEach(handler => handler(deltaTimeSec));
        }
        this.lastStepTimestamp = timestamp;
        this.requestFrameId = requestAnimationFrame(this.timerLoop);
    };
}

export default new Timer();
