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
  rezepte = [[, 312, 3.5, false], ["Rezept 2", "true", 4.5, true], ["Rezept 3",312 , , true],["Rezept 4",42 , 4, ]]  
  
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
