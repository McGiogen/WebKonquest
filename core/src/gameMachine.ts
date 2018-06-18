import {GameEvent} from "./event";
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

    log.info(`Turn of ${this.currentState}.`);
    this.currentState.onEntry();
  }

  stop(): void {
    this.initialState = this.currentState;
    this.currentState = null;
  }

  addState(state: GameMachineState) {
    this.states.push(state);
  }

  isRunning(): boolean {
    return this.currentState != null;
  }

  /**
   * Start the turn of the next player. Return its index.
   * Neutral should always be the first player, with index 0.
   * @returns {number} Index of player
   */
  next(): number {
    if (!this.isRunning()) {
      return;
    }
    this.currentState.onExit();
    const nextStateIndex = (this.states.indexOf(this.currentState) + 1) % this.states.length;

    this.currentState = this.states[nextStateIndex];
    log.info(`Turn of ${this.currentState}`);
    this.currentState.onEntry();

    return nextStateIndex;
  }
}

export interface GameMachineState {
  onEntry: () => void
  onExit: () => void
}
