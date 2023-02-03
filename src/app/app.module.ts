import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TurnComponent } from './turn/turn.component';
import { TokenJwtComponent } from './token-jwt/token-jwt.component';
import { FormsModule } from '@angular/forms';
import {ClipboardModule} from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    AppComponent,
    TurnComponent,
    TokenJwtComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ClipboardModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
