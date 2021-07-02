import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  constructor(
    private firebase: AngularFireStorage,
  ) { }

  /**
   * Liest Bild aus Firebase Storage aus. Ordner: rezepte
   * @param rezeptId 
   * @returns Referenz eines Bild aus dem Firebase Storage als URL
   * Autor: Adrian Przybilla
   */
  getRezeptFile(rezeptId: string) {
    const path = "rezepte";
    const fileName = rezeptId;

    // Rückgabe des Bild als Observable
    return this.firebase.ref(`${path}/${fileName}`).getDownloadURL();

    /*
    Bild auslesen und in Variable speichern
    profileUrl: Observable<string | null>;
    this.profileUrl = this.filestorage.getRezeptFile(rezeptId);
    <img [src]="profileUrl | async" />
    */
  }

  /**
   * Setzt Bild in Firebase Storage. Ordern: rezepte
   * @param event 
   * Autor: Adrian Przybilla
   */
  setRezeptFile(event) {
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
   * Löschen eines Bild in Firebase Storage
   * @param rezeptId 
   * @returns Promise zur Bestätigung des Löschvorgang
   * Autor: Adrian Przybilla
   */
  removeRezeptFile(rezeptId: string) {
    const path = "rezepte";
    const fileName = rezeptId;

    // Rückgabe des Bild als Observable
    return this.firebase.ref(`${path}/${fileName}`).delete().toPromise();
  }
  
  /**
   * Liest Bild aus Firebase Storage aus. Ordner: kochbuecher
   * @param rezeptId 
   * @returns Referenz eines Bild aus dem Firebase Storage als URL
   * Autor: Adrian Przybilla
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
   * Setzt Bild in Firebase Storage. Ordner: kochbuecher
   * @param event Trigger-Event
   * Autor: Adrian Przybilla
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
