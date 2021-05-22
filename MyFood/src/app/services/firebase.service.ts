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

  // Platzhalter für spätere Umsetzung
  // Helfer-Funktionen für Objekt-Erstellung
  getZutatenObject() { }
  getRezeptInhalte() { }

  createRezept(name: string, userId: string, zutaten: object, inhalte: object) { }
  setEigenesRezept(rezeptName: string, userId: string) { }

  /**
   * Liest einzelnes Rezept aus und speichert alles aus der Datenbank in einem JSON-Object
   * @param name 
   * @returns Object des angefragten Rezept
   */
  getRezeptByName(name: string): Object {
    let rezept:any = {
      "ersteller": {},
      "inhalte": {},
      "zutaten": {}
    };
    
    // Get alle Werte aus dem übergebenen Document
    this.firestore.collection("Rezepte").doc(name).snapshotChanges().subscribe(res => {
      rezept.ersteller = Object.values(res.payload.data())[0];
    });

    // Abfrage der Inhalte & Zutaten des Rezept
    rezept.inhalte = this.getInhalteFuerRezept(name);
    rezept.zutaten = this.getZutatenFuerRezept(name);

    return rezept;
  }

  /**
   * Führt getRezeptByName öfter aus und gibt ein Object mit mehreren Rezepten zurück
   * @param name 
   * @returns Object aller angefragten Rezepte
   */
  getRezepteByName(name: Array<string>): Object {
    let rezepte = {};
    
    name.forEach(item => {
      rezepte[item] = this.getRezeptByName(item);
    });

    return rezepte;
  } // Filtermöglichkeiten hier hinzufügen
  
  /**
   * Fragt alle Rezepte einzeln an
   * @returns Object mit allen Rezepten
   */
  getAlleRezepte(): Object {
    let rezepte = {};

    this.firestore.collection("Rezepte").get().subscribe(res => {
      console.log(res);
      res.docs.forEach(element => {
        rezepte[element.id] = {
          "ersteller": element.data(),
          "inhalte": {},
          "zutaten": {}
        };
        // Anfragen der Inhalte & Zutaten des Rezept
        rezepte[element.id].inhalte = this.getInhalteFuerRezept(element.id);
        rezepte[element.id].zutaten = this.getZutatenFuerRezept(element.id);
      });
    });

    return rezepte;
  }

  /**
   * Anfrage von Collections innerhalb eines Documents
   * @param name 
   * @returns Object der Inhalte des übergebenen Rezept
   */
  getInhalteFuerRezept(name: string): Object {
    let inhalte = {};

    this.firestore.collection("Rezepte").doc(name).collection("Inhalte").snapshotChanges().subscribe(res => {
      res.forEach(item => {
        inhalte[item.payload.doc.id] = item.payload.doc.data();
      });
    });

    return inhalte;
  }

  /**
   * Anfrage von Collections innerhalb eines Documents
   * @param name 
   * @returns Object der Zutaten des übergebenen Rezept
   */
  getZutatenFuerRezept(name: string): Object {
    let zutaten = {};

    // Get Collection "Inhalte" aus dem übergebenen Document
    this.firestore.collection("Rezepte").doc(name).collection("Zutaten").snapshotChanges().subscribe(res => {
      res.forEach(item => {
        zutaten[item.payload.doc.id] = item.payload.doc.data();
      });
    });

    return zutaten;
  }

  createZutat(name: string, einheit: string, kalorien: number) { }
  getZutat(name: string) { }
  getZutaten(name: Array<string>) { }
  getAlleZutaten() { }

  setFavorit(rezeptName: string, userId: string) { }
  getAlleFavoriten(userId: string) { }
}
