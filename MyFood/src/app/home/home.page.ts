import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ComponentsModule } from '../components/components.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private rezepte = [["1"], ["2"], ["3"]]  
  
  constructor (
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  logout () {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl("/login");
    }).catch(e => {
      console.log(e);
    });
  }
}
