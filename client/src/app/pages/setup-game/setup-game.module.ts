import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../../components/components.module';

import { SetupGamePage } from './setup-game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SetupGamePage
      }
    ])
  ],
  declarations: [SetupGamePage]
})
export class SetupGamePageModule {}
