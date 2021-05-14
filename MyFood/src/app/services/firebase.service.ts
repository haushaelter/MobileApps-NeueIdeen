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
        temp.push({ title: task.payload.doc.id })
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
    this.auth.createUserWithEmailAndPassword(email, passwort).then((res) => {
      this.router.navigateByUrl("/home");
    }).catch(e => {
      console.log(e);
    });
  }

  /**
   * Login, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   * @param passwort 
   */
  login(email, passwort) {
    this.auth.signInWithEmailAndPassword(email, passwort).then((res) => {
      this.router.navigateByUrl("/home");
    }).catch(e => {
      console.log(e);
    });
  }

  /**
   * Passwort zurücksetzen, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   */
  passwortVergessen(email) {
    this.auth.sendPasswordResetEmail(email).then((r) => {
      console.log("Passwort zurück gesetzt.");
      this.router.navigateByUrl("Login");
    }).catch(e => {
      console.log(e);
    });
  }
}
