import {gameEmitter, GAME_EVENT} from "./event";

export class GameMachine {
  initialState: GameMachineState;
  currentState: GameMachineState;
  private states: Array<GameMachineState>;

  constructor() {
    this.initialState = null;
    this.currentState = null;
    this.states = [];

    gameEmitter.on(GAME_EVENT.PLAYER_TURN_DONE, this.next.bind(this));
  }

  start(): void {
    console.log('The game is starting');
    this.currentState = this.initialState;
    console.log('Turn of ' + this.currentState.toString());
    this.currentState.onEntry();
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
    if (this.currentState) {
      this.currentState.onExit();
    }
    const nextStateIndex = (this.states.indexOf(this.currentState) + 1) % this.states.length;
    this.currentState = this.states[nextStateIndex];
    console.log('Turn of ' + this.currentState.toString());
    this.currentState.onEntry();
  }
}

export interface GameMachineState {
  onEntry: () => void
  onExit: () => void
}
