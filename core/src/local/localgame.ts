import {Game} from "../game";
import {Player} from "../player";
import {GameConfig} from "../config";
import {log} from "../logger";

export class LocalGame extends Game {
  constructor(gameConfig: GameConfig) {
    super(gameConfig);
  }

  start() {
    if (!this.machine.isRunning()) {
      this.buildMachine();
      log.debug('Starting machine');
      this.machine.start();
      // this.qApp.processEvents();  // Really important : ignoring this will not apply the change soon enough
      log.debug(`Machine state ${this.machine.isRunning()}`)
    }
  }

  stop(): void {
    if (this.machine.isRunning()) {
      this.machine.stop();
      // this.qApp.processEvents();  // Really important : ignoring this will not apply the change soon enough
      log.debug(`Machine state ${this.machine.isRunning()}`)
    }
  }

  addPlayer(player: Player): void {
    if (!this.model.players.includes(player)) {
      this.model.players.push(player);
    }
  }

  buildMachine(): void {
    log.debug('Building machine');
    if (this.machine.isRunning()) {
      return;
    }

    // Player is a subclass of QState and the constructor of Player already adds
    // the new Player object to m_gameMachine by passing it to the superclass
    // constructor QState(QState *parent = 0).
    // Accordingly, we can instantly go ahead with configuring the other
    // parts of the machine.

    this.machine.addState(this.model.neutral);
    this.machine.initialState = this.model.neutral;

    // Now add transitions
    for (let i = 0; i < this.model.players.length; i++) {
      const player = this.model.players[i];
      const nextPlayer = this.model.players[i];
      this.machine.addState(player);

      log.debug(`Adding transition from ${player} to ${nextPlayer}.`)
    }
  }

  // playerIsDone(): void {
    //log.debug(`It seems a player is done: ${this.currentPlayer}.`)
  // }
}

