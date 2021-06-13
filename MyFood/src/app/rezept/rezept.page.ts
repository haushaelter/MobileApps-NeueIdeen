import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Rezept } from '../models/rezepte/rezept.model';
import { Schritt } from '../models/rezepte/schritt.model';
import { IndividuelleAngaben } from '../models/user/individuelle-angaben.model';
import { RezeptReferenz } from '../models/user/rezept-referenz.model';
import { User } from '../models/user/user.model';
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
  private _fav = "star-outline";
  private bewertungText:string;
  private sterne: Array<string>;
  private eigeneBewertung: boolean = false;
  private gesamtbewertung: boolean = true;
  bild: Observable<string | null>;

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
    private filestorage: FileStorageService
  ) {
    this.id = this.id.replace("%20", " ");
    this.data = firebase.getRezept(this.id);
    this.aktuellerUser = firebase.getUser(this.aktuelleUserId);
    this.bild = this.filestorage.getRezeptFile(this.id);
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
  
}
