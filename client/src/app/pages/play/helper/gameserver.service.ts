import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Subscription } from 'rxjs';
import {environment} from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class GameServerService {

  private socket: WebSocketSubject<any>;

  constructor() {
    this.socket = new WebSocketSubject(GameServerService.getWsUrl('/api/socket'));
  }

  public subscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.socket
      .subscribe(
        (message) => {
          console.debug('Ws Message', message);
          if (next) next(message);
        },
        (err) => {
          console.error('Ws Error', err);
          if (error) error(err);
        },
        () => {
          console.info('Ws Completed');
          if (complete) complete();
        }
      );
  }

  public send(type: string, data: any): void {
    const message = {
      type,
      data,
    };
    console.debug('Send Ws Message', message);
    this.socket.next(message);
  }

  private static getWsUrl(s: string): string {
    let l = environment.production ? window.location : { protocol: 'http:', host: `${window.location.hostname}:8080`};
    return (l.protocol === 'https:' ? 'wss:///' : 'ws:///') + l.host + s;
  }
}
