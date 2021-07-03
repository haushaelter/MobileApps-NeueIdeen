import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Kochbuch } from 'src/app/models/kochbuecher/kochbuch';
import { FileStorageService } from 'src/app/services/file-storage.service';
import { ListService } from 'src/app/services/list.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-list-kochbuch',
  templateUrl: './list-kochbuch.component.html',
  styleUrls: ['./list-kochbuch.component.scss'],
})
/**
 * Autor: Anika Haushälter
 */
export class ListKochbuchComponent {
  private data:Kochbuch;
  private bild: Observable<string | null>;
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

    this.bild = this.storage.getKochbuchFile(this.data.id);
  }

  /**
   * @ignore
   * @param logging {HelperService} Dependency Injection
   * @param listService {ListService} Dependency Injection
   * @param navCtrl {NavController} Dependency Injection
   * @param storage {FileStorageService} Dependency Injection
   */
  constructor(
    private logging: HelperService,
    private listService: ListService,
    private navCtrl: NavController,
    private storage: FileStorageService
  ) {}

  /**
   * Autor: Anika Haushälter
   * Aufrufen von Buch. Navigiert zur Seite Kochbuch
   * @returns {void}
   */
  private buchAufrufen():void{
    if(this.data.id==undefined){
      this.logging.zeigeToast("Es ist ein Fehler beim Aufrufen aufgetreten.")
    }
    
    this.navCtrl.navigateForward(`/kochbuch?id=${this.data.id}`, {state: {buch: this.data}});
    
  }
}
