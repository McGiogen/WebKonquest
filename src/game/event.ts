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

export const GAME_EVENT = Object.freeze({
  GAME_START: 'game:start',
  PLAYER_TURN_DONE: 'game:player:done',
  PLAYER_TURN_START: 'game:player:start',
});
