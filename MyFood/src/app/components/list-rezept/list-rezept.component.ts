import { Component, Input, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Rezept } from 'src/app/models/rezepte/rezept.model';
import { User } from 'src/app/models/User/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ListService } from 'src/app/services/list.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-list-rezept',
  templateUrl: './list-rezept.component.html',
  styleUrls: ['./list-rezept.component.scss'],
})
export class ListRezeptComponent implements OnInit {
  readonly currentUser = this.firebase.getUser(this.authService.getAktuellerUser().uid);
 
  data:Rezept;


  _anzahlText = "keine Bewertungen";
  _sterne = Array<String>();
  _fav;
  _bearbeitet = false;
  _bewertung = 'bewertung';
  @Input() 
  set rezept (rezept:Rezept){
    
    if(rezept === null){
      return;
    }

    this.data = rezept;

    this.data.id = this.listService.checkString("Titel", rezept.id);    

    this.data.inhalte.bewertung.anzahl = this.listService.checkNumber(rezept.inhalte.bewertung.anzahl);
    this._anzahlText = `${this.data.inhalte.bewertung.anzahl} Bewertungen`;

    this._sterne = this.listService.checkStars(rezept.inhalte.bewertung.bewertung);

    

    // //Überprüfen, ob eine eigene Bewertung gemacht wurde
    // if(rezept['eigeneBewertung']!=false && rezept['eigeneBewertung'] !=undefined){
    //   this._bewertung= 'eigeneBewertung';
    //   this._anzahlText = 'eigene Bewertung'
    // }

    //Überprüfen auf Favorit 
    if(rezept['favorit']){
      this._fav = "star";
    } else {
      this._fav = "star-outline";
    }

    //Bearbeitet
    if(typeof rezept['bearbeitet'] == "boolean"){
      this._bearbeitet=rezept['bearbeitet'];
    }
  }

  constructor(
    private logging: HelperService,
    private listService: ListService,
    private authService: AuthService,
    private firebase: FirebaseService,
    private navCtrl: NavController
    ) {}

  ngOnInit() {}

  setFavorit(){    
    if(this.data.id==undefined || this.currentUser.id==undefined){
      this.logging.zeigeToast("Es ist ein Fehler beim favorisieren aufgetreten.");
      this.logging.logging(`Rezeptid = ${this.data.id} und Userid = ${this.currentUser.id}`);
      return;
    }
    this.logging.logging(`Favorit ${this.data.id} bei User ${this.currentUser.id} gesetzt`);
    this.firebase.setFavorit(this.data.id, this.currentUser.id);
  }

  rezeptAufrufen(){
    if(this.data.id==undefined){
      this.logging.zeigeToast("Es ist ein Fehler beim Aufrufen des Rezeptes aufgetreten.")
      return;
    }
    this.navCtrl.navigateForward(`/rezept?id=${this.data.id}`);
    
  }

}
