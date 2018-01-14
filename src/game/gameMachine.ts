import {gameEmitter, GAME_EVENT} from "./event";

export class GameMachine {
  currentState: GameMachineState;
  private _initialState: GameMachineState;
  private states: Array<GameMachineState>;

  constructor() {
    this.currentState = null;
    this._initialState = null;
    this.states = [];

    gameEmitter.on(GAME_EVENT.PLAYER_TURN_DONE, this.next);
  }

  set initialState(state: GameMachineState) {
    this._initialState = state;
  }

  start(): void {
    this.currentState = this.states[0];
  }

  stop(): void {
    this.currentState = null;
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
    const nextStateIndex = (this.states.indexOf(this.currentState) + 1) % this.states.length;
    this.currentState = this.states[nextStateIndex];
  }
}

export interface GameMachineState {
  onEntry: () => void
  onExit: () => void
}
