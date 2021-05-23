import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-list-rezept',
  templateUrl: './list-rezept.component.html',
  styleUrls: ['./list-rezept.component.scss'],
})
export class ListRezeptComponent implements OnInit {
  _titel = 'Titel nicht gefunden';
  _anzahl = 0;
  _anzahlText = "keine Bewertungen";
  _sterne = Array<String>();
  _fav;
  _bearbeitet = false;
  _bewertung = 'bewertung';
  @Input() 
  set rezept (rezept:JSON){

    if(rezept === null){
      return;
    }
    //Define Title
    if(typeof rezept['titel'] == "string" && rezept['titel'] !=="undefined"){
      this._titel = `${rezept['titel']}`;
    } else {
      this.logging.logging("Kein Titel übergeben")
    }

    //Define Number of Likes (Problem: Überprüfen, ob keine Anzahl an Sternen übergeben wurde)
    if(typeof rezept['anzahl'] == "number"){
      this._anzahl = rezept['anzahl'];
    } else {
      this.logging.logging("Keine Anzahl an Bewertungen übergeben");
    }
    this._anzahlText = `${this._anzahl} Bewertungen`;

    //Define Number of stars
    let i = 0; 
    //Überprüfen, ob eine eigene Bewertung gemacht wurde
    if(rezept['eigeneBewertung']!=false && rezept['eigeneBewertung'] !=undefined){
      this._bewertung= 'eigeneBewertung';
      this._anzahlText = 'eigene Bewertung'
    }
    //Bei 0 Bewertungen wird die Bewertung auch auf 0 gesetzt
    if(this._anzahl != 0){
      for(i; i<rezept[this._bewertung] && i<5; ){
        if(rezept[this._bewertung]<++i){
          this._sterne.push("star-half-outline");
        } else {
          this._sterne.push("star");
        }
      }
    }
    for( i; i<5; i++){
      this._sterne.push("star-outline");
    }

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
    private alertCtrl: AlertController, 
    private toastCtrl: ToastController,
    private logging: HelperService
    ) {}

  ngOnInit() {}

}
