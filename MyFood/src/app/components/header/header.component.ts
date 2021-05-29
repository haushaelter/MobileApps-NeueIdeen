import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  private _titel:string;

  @Input() 
  set titel(titel:string){
    this._titel=titel;
    if(this._titel=="Login"){
      document.getElementById("logout").style.display = "none";
    }
  }

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {}

  logout() {this.auth.logout();
  }
}
