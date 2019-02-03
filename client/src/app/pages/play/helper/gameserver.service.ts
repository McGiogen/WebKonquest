import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameServerService {

  public socket: WebSocketSubject<any>;

  constructor() {
    this.socket = WebSocketSubject.create(GameServerService.getWsUrl('/api/socket'));
  }

  public subscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.socket
      .subscribe(
        (message) => {
          console.log('Ws Message', message);
          if (next) next(message);
        },
        (err) => {
          console.error('Ws Error', err);
          if (error) error(err);
        },
        () => {
          console.warn('Ws Completed');
          if (complete) complete();
        }
      );
  }

  public send(type: string, data: any): void {
    this.socket.next(JSON.stringify({
      type,
      data,
    }));
  }

  private static getWsUrl(s: string): string {
    let l = window.location;
    return (l.protocol === 'https:' ? 'wss:///' : 'ws:///') + l.host + s;
  }
}
