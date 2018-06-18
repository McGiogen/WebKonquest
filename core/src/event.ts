import {Event} from "typescript.events";

export class GameEmitter extends Event {}

/**** HOW TO USE ****
 *
 * const gameEmitter = new GameEmitter();
 *
 * gameEmitter.on('event', (..params) => {
 *   console.log('event occured')
 * });
 *
 * gameEmitter.emit('event', ..params);
 *
*/

// export const enum GameEvent {
//   GameStart = 'game:start',
//   PlayerTurnDone = 'game:player:done',
//   PlayerTurnStart = 'game:player:start',
//   GameOver = 'game:over',
// }

export const GameEvent = {
  GameStart: 'game:start',
  PlayerTurnDone: 'game:player:done',
  PlayerTurnStart: 'game:player:start',
  RoundStart: 'game:round:start',
  GameOver: 'game:over',
};
