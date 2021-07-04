import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Autor: Adrian Przybilla
 */
export class FileStorageService {

  /**
   * @ignore
   * @param firebase 
   * @param logging
   */
  constructor(
    private firebase: AngularFireStorage,
    private logging: HelperService
  ) { }

  /**
   * Autor: Anika Haushälter und Adrian Przybilla
   * 
   * Liest Bild aus Firebase Storage aus. Ordner: rezepte
   * @param rezeptId 
   * @returns Referenz eines Bild aus dem Firebase Storage als URL
   */
  getRezeptFile(rezeptId: string) {
    const path = "rezepte";
    const fileName = rezeptId;

    // Rückgabe des Bild als Observable
    return this.firebase.ref(`${path}/${fileName}`)?.getDownloadURL().pipe(catchError(error => {
      this.logging.logging(`Fehler: Bild für ${fileName} nicht gefunden`);
      return of(null);
    }));

    /*
    Bild auslesen und in Variable speichern
    profileUrl: Observable<string | null>;
    this.profileUrl = this.filestorage.getRezeptFile(rezeptId);
    <img [src]="profileUrl | async" />
    */
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Setzt Bild in Firebase Storage. Ordner: rezepte
   * @param event 
   */
  private setRezeptFile(event) {
    const file = event.target.files[0];
    const filePath = event.target.title;
    const path = "rezepte";

    // Bild speichern
    this.firebase.ref(`${path}/${filePath}`).put(file);

    /*
    Bild ablegen durch HTML-Input-Feld
    <input type="file" title={{rezept.id}} (change)="filestorage.setRezeptFile($event)">
    */
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Löschen eines Bild in Firebase Storage
   * @param rezeptId 
   * @returns Promise zur Bestätigung des Löschvorgang
   */
  removeRezeptFile(rezeptId: string) {
    const path = "rezepte";
    const fileName = rezeptId;

    // Rückgabe des Bild als Observable
    return this.firebase.ref(`${path}/${fileName}`).delete().toPromise();
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Liest Bild aus Firebase Storage aus. Ordner: kochbuecher
   * @param rezeptId 
   * @returns Referenz eines Bild aus dem Firebase Storage als URL
   */
  getKochbuchFile(rezeptId: string) {
    const path = "kochbuecher";
    const fileName = rezeptId;

    // Rückgabe des Bild als Observable
    return this.firebase.ref(`${path}/${fileName}`).getDownloadURL();

    /*
    Bild auslesen und in Variable speichern
    profileUrl: Observable<string | null>;
    this.profileUrl = this.filestorage.getKochbuchFile(kochbuchId);
    */
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Setzt Bild in Firebase Storage. Ordner: kochbuecher
   * @param event Trigger-Event
   */
  setKochbuchFile(event) {
    const file = event.target.files[0];
    const filePath = event.target.title;
    const path = "kochbuecher";

    // Bild speichern
    this.firebase.ref(`${path}/${filePath}`).put(file);

    /*
    Bild ablegen durch HTML-Input-Feld
    <input type="file" title={{data.id}} (change)="filestorage.setKochbuchFile($event)">
    */
  }
}
