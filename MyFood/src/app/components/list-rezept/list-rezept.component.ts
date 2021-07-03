import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Rezept } from 'src/app/models/rezepte/rezept.model';
import { User } from 'src/app/models/User/user.model';
import { FileStorageService } from 'src/app/services/file-storage.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ListService } from 'src/app/services/list.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-list-rezept',
  templateUrl: './list-rezept.component.html',
  styleUrls: ['./list-rezept.component.scss'],
})
/**
 * Autor: Anika Haushälter
 */
export class ListRezeptComponent {
  readonly aktuelleUserId = localStorage.getItem('user');
 
  //vollständiges Rezept
  private data:Rezept;
  
  //Variablen für angepasste Anzeigestrings
  private _anzahlText = "keine Bewertungen";
  private _sterne = Array<String>();
  private _fav:string = "star-outline";
  private _bearbeitet = false;
  private bild: Observable<string | null>;
    
  /**
   * Autor: Anika Haushälter
   * Entgegennehmen von Rezept. Überprüft, ob die enthaltenen Daten vorhanden sind und ersetzt falls nicht
   */
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

  /**
   * Autor: Anika Haushälter
   * Entgegennehmen von User. Überprüft auf wichtige Eigenschaften und passt bei eigener Bewertung diese in der Variablen data an
   */
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

  /**
   * @ignore
   * @param logging 
   * @param listService 
   * @param firebase 
   * @param navCtrl 
   * @param filestorage 
   */
  constructor(
    private logging: HelperService,
    private listService: ListService,
    private firebase: FirebaseService,
    private navCtrl: NavController,
    private filestorage: FileStorageService
    ) {}

  /**
   * Autor: Anika Haushälter
   * Favorisieren von Rezept. Verwendet Rezept und eingeloggten User
   * @returns void
   */
  private setFavorit():void{    
    if(this.data.id==undefined || this.aktuelleUserId==undefined){
      this.logging.zeigeToast("Es ist ein Fehler beim favorisieren aufgetreten.");
      this.logging.logging(`Rezeptid = ${this.data.id} und Userid = ${this.aktuelleUserId}`);
      return;
    }
    if(this._fav=="star-outline"){
      this.firebase.setFavorit(this.data.id, this.aktuelleUserId);
      this._fav = "star";
      this.logging.logging(`Favorit ${this.data.id} bei User ${this.aktuelleUserId} gesetzt`);
    } else {
      this.firebase.removeFavorit(this.data.id, this.aktuelleUserId);
      this._fav = "star-outline";
      this.logging.logging(`Favorit ${this.data.id} bei User ${this.aktuelleUserId} entfernt`);
    }
  }

  /**
   * Autor: Anika Haushälter
   * OnClick Listener für Rezepte. Navigiert zum entsprechendem Rezept
   * @returns void
   */
  private rezeptAufrufen():void{
    if(this.data.id==undefined){
      this.logging.zeigeToast("Es ist ein Fehler beim Aufrufen des Rezeptes aufgetreten.")
      return;
    }
    this.navCtrl.navigateForward(`/rezept?id=${this.data.id}`);
    
  }

}
