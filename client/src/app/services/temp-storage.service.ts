import { Injectable } from '@angular/core';
import { SetupGame } from '../pages/setup-game/SetupGameData';

@Injectable({ providedIn: 'root' })
export class TempStorageService {
  public setupGame: SetupGame;

  constructor() { }

}
