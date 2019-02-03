import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../../components/components.module';

import { PlayPage } from './play.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PlayPage
      }
    ])
  ],
  declarations: [PlayPage]
})
export class PlayPageModule {}
