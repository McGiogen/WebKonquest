import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'options', loadChildren: './pages/options/options.module#OptionsPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'setup-game', loadChildren: './pages/setup-game/setup-game.module#SetupGamePageModule' },
  { path: 'play', loadChildren: './pages/play/play.module#PlayPageModule' },
  { path: 'gameover', loadChildren: './pages/gameover/gameover.module#GameoverPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
