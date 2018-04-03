import {gameEmitter, GameEvent} from "./event";
import {log} from "./logger";

export class GameMachine {
  initialState: GameMachineState;
  currentState: GameMachineState;
  private states: Array<GameMachineState>;

  constructor() {
    this.initialState = null;
    this.currentState = null;
    this.states = [];
  }

  start(): void {
    if (!this.initialState) {
      throw new Error('Game machine cannot start. Initial state is null.');
    }

    log.info('New game starting.');
    this.currentState = this.initialState;
    gameEmitter.on(GameEvent.PlayerTurnDone, this.next.bind(this));

    log.info(`Turn of ${this.currentState}.`);
    this.currentState.onEntry();
  }

  stop(): void {
    this.currentState = null;
    gameEmitter.emit(GameEvent.GameOver);
  }

  addState(state: GameMachineState) {
    this.states.push(state);
  }

  isRunning(): boolean {
    return this.currentState != null;
  }

  private next() {
    if (!this.isRunning()) {
      return;
    }
    this.currentState.onExit();
    const nextStateIndex = (this.states.indexOf(this.currentState) + 1) % this.states.length;
    this.currentState = this.states[nextStateIndex];
    log.info(`Turn of ${this.currentState}`);
    this.currentState.onEntry();
  }
}

export interface GameMachineState {
  onEntry: () => void
  onExit: () => void
}
