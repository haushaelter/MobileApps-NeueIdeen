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
  /*getZutatObject(zutatMenge:number):Zutat {
    let zutat: Zutat;

    zutat = {
      "Menge": zutatMenge
    }

    return zutat;
  }*/

  // getRezeptInhalte(
  //   beschreibung: string,
  //   titel: string,
  //   bewertung: number,
  //   schritte: Array<Schritt>
  // ):Inhalte {
  //   let inhalte: Inhalte;
    
  //   inhalte.Basis = {
  //     Beschreibung: beschreibung,
  //     Titel: titel
  //   }
  //   inhalte.Bewertung= {
  //     Anzahl: 1,
  //     Bewertung: bewertung
  //   }

  //   /*schritte.forEach((item, index) => {
  //     inhalte[index] = item;
  //   });*/

  //   return inhalte;
  // }

  // setRezept(name: string, userId: string, zutaten: object, inhalte: object) {
  //   this.firestore.collection("Rezept").doc(name).set({
  //     ersteller: userId
  //   });
  //   for(let item in inhalte){
  //     this.firestore.collection("Rezept").doc(name).collection("inhalte").doc(item.).set({

  //     });
  //   }
    
  // }
  // setEigenesRezept(rezeptName: string, userId: string) {
  //   this.firestore.collection("User").doc(userId).update({
  //     //EigeneRezepte: rezeptName
  //   });
  // }

  /**
   * Liest einzelnes Rezept aus und speichert alles aus der Datenbank in einem JSON-Object
   * @param name 
   * @returns Object des angefragten Rezept
   */
  getRezeptByName(name: string): JSON {
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

    return <JSON>rezept;
  }

  /**
   * Führt getRezeptByName öfter aus und gibt ein Object mit mehreren Rezepten zurück
   * @param name 
   * @returns Object aller angefragten Rezepte
   */
  getRezepteByName(name: Array<string>): JSON {
    let rezepte = {};
    
    name.forEach(item => {
      rezepte[item] = this.getRezeptByName(item);
    });

    return <JSON>rezepte;
  } // Filtermöglichkeiten hier hinzufügen
  
  /**
   * Fragt alle Rezepte einzeln an
   * @returns Object mit allen Rezepten
   */
  getAlleRezepte(): Array<JSON> {
    let rezepte = [];

    this.firestore.collection("Rezepte").get().subscribe(res => {
      console.log(res);
      res.docs.forEach(element => {
        rezepte.push({
          id: element.id,
          ersteller: Object.values(element.data())[0],
          inhalte: this.getInhalteFuerRezept(element.id),
          zutaten: this.getZutatenFuerRezept(element.id)
        })
        
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
