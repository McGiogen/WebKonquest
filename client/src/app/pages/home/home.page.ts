import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public isOnline: boolean;

  constructor() {
    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = navigator.onLine;
    });

    window.addEventListener('offline', () => {
      this.isOnline = navigator.onLine;
    })
  }

  ngOnInit(): void {
    this.isOnline = navigator.onLine;
  }
}
