import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Rezept } from 'src/app/models/rezepte/rezept.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {}

  zufall(){
    let id = "Hartgekochtes Ei";
    
    this.navCtrl.navigateForward(`/rezept?id=${id}`);
  }

}
