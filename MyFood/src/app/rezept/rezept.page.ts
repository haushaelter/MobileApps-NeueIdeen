import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Rezept } from '../models/rezepte/rezept.model';
import { Schritt } from '../models/rezepte/schritt.model';
import { IndividuelleAngaben } from '../models/user/individuelle-angaben.model';
import { RezeptReferenz } from '../models/user/rezept-referenz.model';
import { User } from '../models/user/user.model';
import { Zutat } from '../models/zutaten/zutat.model';
import { AuthService } from '../services/auth.service';
import { FileStorageService } from '../services/file-storage.service';
import { FirebaseService } from '../services/firebase.service';
import { HelperService } from '../services/helper.service';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-rezept',
  templateUrl: './rezept.page.html',
  styleUrls: ['./rezept.page.scss'],
})
export class RezeptPage implements OnInit {
  readonly aktuelleUserId = localStorage.getItem('user');
  private id: string = this.activatedRoute.snapshot.queryParamMap.get("id");
  private data: Rezept;
  private aktuellerUser: User;
  private schritte: Array<Schritt> = new Array;
  private _fav:string = "star-outline";
  private bewertungText:string;
  private sterne: Array<string>;
  private eigeneBewertung: boolean = false;
  private gesamtbewertung: boolean = true;
  private bild: Observable<string | null>;
  private zutatenRef:  Observable<any | null>;
  zutatenEinheit = [];

  zutatenObj;

  @Input() 
  set rezept (rezept:Rezept){
    this.data = rezept;
  }

  @Input()
  set user (user:User){
    if(user.favoriten!=undefined){      
      if(user.favoriten.includes(this.data.id)){
        this._fav="star";
        return;
      }
    }
    this._fav="star-outline";
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebase: FirebaseService,
    private listService: ListService,
    private auth: AuthService,
    private filestorage: FileStorageService,
    private navCtrl: NavController,
    private logging: HelperService
  ) {
    this.id = this.id.replace("%20", " ");
    this.data = firebase.getRezept(this.id);
    this.aktuellerUser = firebase.getUser(this.aktuelleUserId);
    this.bild = this.filestorage.getRezeptFile(this.id);
    this.zutatenObj = this.firebase.getAlleZutatenAlsObject();
  }

  ngOnInit() {
  }

  
  readData(){    
    this.data.id = this.listService.checkString("Titel", this.data.id);    

    this.data.inhalte.bewertung.anzahl = this.listService.checkNumber(this.data.inhalte.bewertung.anzahl);

    this.data.inhalte.bewertung.bewertung = this.listService.checkNumber(this.data.inhalte.bewertung.bewertung);

    this.schritte = new Array;
    for(let item in this.data.inhalte){
      
      this.schritte.push(this.data.inhalte[item]);
      
    }

    if(this.aktuellerUser.individuelleAngaben!=undefined){
      if(this.aktuellerUser.individuelleAngaben[this.data.id]!=undefined){
        this.eigeneBewertung=true;
      }
    }

    if(this.eigeneBewertung){
      this.bewertungText="eigene Bewertung";
    }

    if(this.gesamtbewertung){
      if(this.data.inhalte.bewertung.anzahl==1){
        this.bewertungText = `${this.data.inhalte.bewertung.anzahl} Bewertung`;
      } else {
        this.bewertungText = `${this.data.inhalte.bewertung.anzahl} Bewertungen`;
      }
    }
    
    this.sterne = this.listService.checkStars(this.data.inhalte.bewertung.bewertung);
  }

  bewerten(id:number){    
    this.firebase.setBewertung((id+1), this.aktuellerUser, this.data.id);
    this.aktuellerUser = this.firebase.getUser(this.aktuelleUserId);
    this.data.inhalte.bewertung.bewertung = id+1;
    this.eigeneBewertung = true;
    this.gesamtbewertung = false;
  }

  aktualisiereBewertungstext(){
    this.eigeneBewertung = true;
    this.gesamtbewertung = false;
  }

  zutatenString(zutaten){
    let returnString: string = "";
    for(let i = 0; i<zutaten.length; i++){
      returnString = returnString + zutaten[i];
      if(zutaten[i+1]!=undefined){
        returnString = returnString + ", ";
      }
    }
    return returnString;    
  }

  rezeptLoeschen(){
    if(this.data.ersteller != this.aktuelleUserId){
      this.logging.zeigeToast("Nur der Ersteller des Rezeptes kann löschen");
    } else {
      let okButton = {
        text: "Löschen",
        handler: () => {
          this.firebase.deleteRezept(this.data.id);
          this.navCtrl.navigateForward(`/home`);
          this.logging.zeigeToast(`Rezept ${this.data.id} wurde gelöscht`);
        }
      }

      let abbrechenButton = {
        text: "Abbrechen",
        role: "Cancel",
        handler: () =>{
          this.logging.zeigeToast("Vorgang abgebrochen");
        }
      }

      this.logging.zeigeDialog(
        "Löschen", 
        `Willst du wirklich das Rezept ${this.data.id} löschen? Gelöschte Rezepte können nicht wieder hergestellt werden!`, 
        [okButton, abbrechenButton]
      );
    }
  }

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
  
}
