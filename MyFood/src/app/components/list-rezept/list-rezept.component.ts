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
  set rezept (rezept:String[]){
    //Define Title
    if(typeof rezept[0] == "string" && rezept[0] !=="undefined"){
      this._titel = `${rezept[0]}`;
    } else {
      this.logging.logging("Kein Titel übergeben")
    }

    //Define Number of Likes (Problem: Überprüfen, ob keine Anzahl an Sternen übergeben wurde)
    if(typeof rezept[1] == "number"){
      this._anzahl = (Number)(rezept[1]);
    } else {
      this.logging.logging("Keine Anzahl an Bewertungen übergeben");
    }

    //Define Number of stars
    let i = 0; 
    //Bei 0 Bewertungen wird die Bewertung auch auf 0 gesetzt
    if(this._anzahl != 0){
      for(i; i<(Number)(rezept[2]); ){
        if((Number)(rezept[2])<++i){
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
    if((Boolean)(rezept[3])){
      this._fav = "star";
    }
  }

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.logging = new Logging(alertCtrl, toastCtrl);
    // this.logging.logging("Rezeptliste: ", `${this.rezept[0]}`);
  }

  ngOnInit() {}

}
