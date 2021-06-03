import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { Rezept } from '../models/rezepte/rezept.model';
import { Schritt } from '../models/rezepte/schritt.model';
import { FirebaseService } from '../services/firebase.service';
import { HelperService } from '../services/helper.service';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-rezept',
  templateUrl: './rezept.page.html',
  styleUrls: ['./rezept.page.scss'],
})
export class RezeptPage implements OnInit {
  private id: string = this.activatedRoute.snapshot.queryParamMap.get("id");
  private data: Rezept;
  private schritte: Array<Schritt> = new Array;
  _favorit = "star-outline";

  @Input() 
  set rezept (rezept:Rezept){
    this.data = rezept;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebase: FirebaseService,
    private listService: ListService
  ) {
    this.id = this.id.replace("%20", " ");
    this.data = firebase.getRezept(this.id);
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
    

  }
  
}
