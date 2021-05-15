import { CompileTemplateMetadata } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {  } from '@angular/fire/'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
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

  // Platzhalter für spätere Umsetzung
  // Helfer-Funktionen für Objekt-Erstellung
  getZutatenObject() { }
  getRezeptInhalte() { }

  createRezept(name: string, userId: string, zutaten: object, inhalte: object) { }
  setEigenesRezept(rezeptName: string, userId: string) { }
  getRezeptByName(name: string) {
    let test = {};
    this.firestore.collection("Rezepte").doc(name).snapshotChanges().subscribe(res => {
      test = res.payload.data();
    });  

    return test;
  }
  getRezepteByName(name: Array<string>) { } // Filtermöglichkeiten hier hinzufügen
  getAlleRezepte() { }

  createZutat(name: string, einheit: string, kalorien: number) { }
  getZutat(name: string) { }
  getZutaten(name: Array<string>) { }
  getAlleZutaten() { }

  setFavorit(rezeptName: string, userId: string) { }
  getAlleFavoriten(userId: string) { }
}
