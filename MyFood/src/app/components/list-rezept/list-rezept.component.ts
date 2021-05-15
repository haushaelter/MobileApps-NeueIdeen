import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Logging } from '../../services/helper';

@Component({
  selector: 'app-list-rezept',
  templateUrl: './list-rezept.component.html',
  styleUrls: ['./list-rezept.component.scss'],
})
export class ListRezeptComponent implements OnInit {
  _titel = 'Titel nicht gefunden';
  _anzahl = 0;
  _sterne = Array<String>(5);
  _fav = "star-outline";

  logging = null;
  @Input() 
  set rezept (rezept:JSON){
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

    //Define Number of stars
    let i = 0; 
    //Bei 0 Bewertungen wird die Bewertung auch auf 0 gesetzt
    if(this._anzahl != 0){
      for(i; i<rezept['bewertung'] && i<5; ){
        if(rezept['bewertung']<++i){
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
    }
  }

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.logging = new Logging(alertCtrl, toastCtrl);
    // this.logging.logging("Rezeptliste: ", `${this.rezept[0]}`);
  }

  ngOnInit() {}

}
