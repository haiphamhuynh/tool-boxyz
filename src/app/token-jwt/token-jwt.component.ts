import { Component, } from '@angular/core';
import { TurnService } from '../turn.service';
import { TurnComponent } from '../turn/turn.component';

@Component({
  selector: 'app-token-jwt',
  templateUrl: './token-jwt.component.html',
  styleUrls: ['./token-jwt.component.css']
})
export class TokenJwtComponent {
  arrTurnToken : any = [];
  loading = true;
  constructor(private tk : TurnService){};
  ngOnInit(): void {
    this.arrTurnToken = this.tk.arrToken;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }


}
