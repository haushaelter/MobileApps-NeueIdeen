import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Kochbuch } from 'src/app/models/kochbuecher/kochbuch';
import { ListService } from 'src/app/services/list.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-list-kochbuch',
  templateUrl: './list-kochbuch.component.html',
  styleUrls: ['./list-kochbuch.component.scss'],
})
export class ListKochbuchComponent implements OnInit {
  private data:Kochbuch;
  _sterne = Array<String>();

  @Input ()
  set buch(buch:Kochbuch){

    if(buch === null){
      return;
    }

    this.data = buch;

    this.data.id = this.listService.checkString("Titel", buch.id);    
    this.data.verlag = this.listService.checkString("Verlag", buch.verlag);
    
    this.data.bewertung.anzahl = this.listService.checkNumber(buch.bewertung.anzahl);

    this._sterne = this.listService.checkStars(buch.bewertung.bewertung);
  }
  constructor(
    private logging: HelperService,
    private listService: ListService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {}

  /**
   * Aufrufen von Buch. Navigiert zur Seite Kochbuch
   */
  buchAufrufen():void{
    if(this.data.id==undefined){
      this.logging.zeigeToast("Es ist ein Fehler beim Aufrufen aufgetreten.")
    }
    
    this.navCtrl.navigateForward(`/kochbuch?id=${this.data.id}`, {state: {buch: this.data}});
    
  }
}
