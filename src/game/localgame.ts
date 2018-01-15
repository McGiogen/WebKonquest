import {Game} from "./game";
import {Player} from "./player";
import {GameConfig} from "./config";

export class LocalGame extends Game {
  constructor(gameConfig: GameConfig) {
    super(gameConfig);
  }

  start() {
    if (!this.machine.isRunning()) {
      this.buildMachine();
      //qDebug() << "Starting machine";
      this.machine.start();
      // this.qApp.processEvents();  // Really important : ignoring this will not apply the change soon enough
      //qDebug() << "Machine state" << m_gameMachine.isRunning();
    }
  }

  stop(): void {
    if (this.machine.isRunning()) {
      this.machine.stop();
      // this.qApp.processEvents();  // Really important : ignoring this will not apply the change soon enough
      //qDebug() << "Machine state" << m_gameMachine.isRunning();
    }
  }

  addPlayer(player: Player): void {
    if (!this.model.players.includes(player)) {
      this.model.players.push(player);
    }
  }

  buildMachine(): void {
    //qDebug() << "Building machine";
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

    // connect(m_neutral, &NeutralPlayer::donePlaying, this, &LocalGame::playerIsDone);

    // Now add transitions
    for (let i = 0; i < this.model.players.length; i++) {
      this.machine.addState(this.model.players[i]);

      //qDebug() << "Adding transition from "
      //<< player->name() << " to " << nextPlayer->name();
      // connect(player, &Player::donePlaying, this, &LocalGame::playerIsDone);
    }
  }

  // playerIsDone(): void {
    //qDebug() << "It seems a player is done :" << currentPlayer()->name();
  // }
}

