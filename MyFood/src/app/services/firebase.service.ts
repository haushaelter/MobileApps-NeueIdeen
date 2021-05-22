import { CompileTemplateMetadata } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {  } from '@angular/fire/'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore,
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
  /**
   * Liest einzelnes Rezept aus und speichert alles aus der Datenbank in einem JSON-Object
   * @param name 
   * @returns 
   */
  getRezeptByName(name: string) {
    let rezept = {
      "ersteller": {},
      "inhalte": {},
      "zutaten": {}
    };

    // Get alle Werte aus dem übergebenen Document
    this.firestore.collection("Rezepte").doc(name).snapshotChanges().subscribe(res => {
      rezept.ersteller = Object.values(res.payload.data())[0];
    });

    // Get Collection "Inhalte" aus dem übergebenen Document
    this.firestore.collection("Rezepte").doc(name).collection("Inhalte").snapshotChanges().subscribe(res => {
      res.forEach(item => {
        rezept.inhalte[item.payload.doc.id] = item.payload.doc.data();
      });
    });

    // Get Collection "Inhalte" aus dem übergebenen Document
    this.firestore.collection("Rezepte").doc(name).collection("Zutaten").snapshotChanges().subscribe(res => {
      res.forEach(item => {
        rezept.zutaten[item.payload.doc.id] = item.payload.doc.data();
      });
    });

    return rezept;
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
