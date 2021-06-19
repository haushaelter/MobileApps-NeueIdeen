import { Component, Input, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Rezept } from 'src/app/models/rezepte/rezept.model';
import { User } from 'src/app/models/User/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FileStorageService } from 'src/app/services/file-storage.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ListService } from 'src/app/services/list.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-list-rezept',
  templateUrl: './list-rezept.component.html',
  styleUrls: ['./list-rezept.component.scss'],
})
export class ListRezeptComponent implements OnInit {
  readonly aktuelleUserId = localStorage.getItem('user');
 
  data:Rezept;

  _anzahlText = "keine Bewertungen";
  _sterne = Array<String>();
  _fav:string = "star-outline";
  _bearbeitet = false;
  _bewertung = 'bewertung';
  bild: Observable<string | null>;
    
  
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

    this.bild = this.filestorage.getRezeptFile(this.data.id);

    //Bearbeitet
    if(typeof rezept['bearbeitet'] == "boolean"){
      this._bearbeitet=rezept['bearbeitet'];
    }
  }

  @Input()
  set user(user:User){
    if(user.favoriten?.includes(this.data.id)){
      this._fav="star";
    }
    if(user.individuelleAngaben[this.data.id]?.bewertung ?? false){
      this._anzahlText = "eigene Bewertung"
      this.data.inhalte.bewertung.bewertung = user.individuelleAngaben[this.data.id].bewertung;
      this.data.inhalte.bewertung.bewertung = this.listService.checkNumber(this.data.inhalte.bewertung.bewertung);
      this._sterne = this.listService.checkStars(this.data.inhalte.bewertung.bewertung);
    }
    
  }

  constructor(
    private logging: HelperService,
    private listService: ListService,
    private firebase: FirebaseService,
    private auth: AuthService,
    private navCtrl: NavController,
    private filestorage: FileStorageService
    ) {}

  ngOnInit() {}

  /**
   * Favorisieren von Rezept. Verwendet Rezept und eingeloggten User
   * @returns void
   */
  setFavorit():void{    
    if(this.data.id==undefined || this.aktuelleUserId==undefined){
      this.logging.zeigeToast("Es ist ein Fehler beim favorisieren aufgetreten.");
      this.logging.logging(`Rezeptid = ${this.data.id} und Userid = ${this.aktuelleUserId}`);
      return;
    }
    this.logging.logging(`Favorit ${this.data.id} bei User ${this.aktuelleUserId} gesetzt`);
    this.firebase.setFavorit(this.data.id, this.aktuelleUserId);
  }

  /**
   * OnClick Listener für Rezepte. Navigiert zum entsprechendem Rezept
   * @returns void
   */
  rezeptAufrufen():void{
    if(this.data.id==undefined){
      this.logging.zeigeToast("Es ist ein Fehler beim Aufrufen des Rezeptes aufgetreten.")
      return;
    }
    this.navCtrl.navigateForward(`/rezept?id=${this.data.id}`);
    
  }

}
