import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  constructor(
    private firebase: AngularFireStorage,
  ) { }

  getRezeptFile(rezeptId: string){
    const path = "rezepte";
    const fileName = rezeptId;

    // Rückgabe des Bild als Observable
    return this.firebase.ref(`${path}/${fileName}`).getDownloadURL();

    /*
    Bild auslesen und in Variable speichern
    profileUrl: Observable<string | null>;
    this.profileUrl = this.filestorage.getRezeptFile(rezeptId);
    */
  }

  setRezeptFile(event){
    const file = event.target.files[0];
    const filePath = event.target.title;
    const path = "rezepte";
    
    // Bild speichern
    this.firebase.ref(`${path}/${filePath}`).put(file);

    /*
    Bild ablegen durch HTML-Input-Feld
    <input type={rezeptId} (change)="filestorage.setFile($event)">
    */
  }
}
