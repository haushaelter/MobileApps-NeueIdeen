import { CompileTemplateMetadata } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  tasks:any = [];

  constructor(
    private firestore: AngularFirestore,
    private auth:AngularFireAuth,
    private router:Router
  ) { }

  /**
   * Firestore Collection auslesen
   * @param colName 
   * @returns Liste aller Documents
   */
  getCollection(colName) {
    let temp = [];

    this.firestore.collection(colName).snapshotChanges().subscribe(res => {
      res.forEach(task => {
        temp.push({ ...task.payload.doc.data });
      });
    });

    return temp;
  }

  /**
   * Registrierung, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   * @param passwort 
   */
  registrieren(email, passwort) {
    let regOk:boolean;

    this.auth.createUserWithEmailAndPassword(email, passwort).then((res) => {
      regOk = true;
      console.log("Registrierung durchgeführt.");
    }).catch(e => {
      regOk = false;
      console.log(e);
    });
    
    return regOk;
  }

  /**
   * Login, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   * @param passwort 
   */
  login(email, passwort) {
    let loginOk:boolean;
    
    this.auth.signInWithEmailAndPassword(email, passwort).then((res) => {
      loginOk = true;
      console.log("Nutzer eingeloggt.");
    }).catch(e => {
      loginOk = false;
      console.log(e);
    });

    return loginOk;
  }

  /**
   * Passwort zurücksetzen, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   */
  passwortVergessen(email) {
    let zuruecksetzenOk:boolean;

    this.auth.sendPasswordResetEmail(email).then((r) => {
      zuruecksetzenOk = true;
      console.log("Passwort zurück gesetzt.");
    }).catch(e => {
      zuruecksetzenOk = false;
      console.log(e);
    });

    return zuruecksetzenOk;
  }
}
