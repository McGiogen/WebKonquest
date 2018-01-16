import {Event} from "typescript.events";

class GameEmitter extends Event {}

export const gameEmitter = new GameEmitter();

/**** HOW TO USE ****
 *
 * gameEmitter.on('event', (..params) => {
 *   console.log('event occured')
 * });
 *
 * gameEmitter.emit('event', ..params);
 *
*/

export const enum GameEvent {
  GameStart = 'game:start',
  PlayerTurnDone = 'game:player:done',
  PlayerTurnStart = 'game:player:start',
}
