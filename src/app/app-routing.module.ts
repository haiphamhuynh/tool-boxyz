import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenJwtComponent } from './token-jwt/token-jwt.component';
import { TurnComponent } from './turn/turn.component';

const routes: Routes = [
  { path: '', component: TurnComponent},
  { path: 'tool', component: TurnComponent },
  { path: 'token', component: TokenJwtComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
