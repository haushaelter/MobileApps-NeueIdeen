import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Rezept } from "../models/rezepte/rezept.model";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getAlleRezepte(): Array<Rezept> {
    let rezepte: Array<Rezept> = [];
    let rezept, inhalte = {}, zutaten = {};

    this.firestore.collection("Rezepte").get().subscribe(res => {
      res.docs.forEach(element => {
        this.getInhalteFuerRezept(element.id).subscribe(resIn => {
          this.getZutatenFuerRezept(element.id).subscribe(resZut => {

            resIn.forEach(item => {
              inhalte[item.payload.doc.id] = item.payload.doc.data();
            });

            resZut.forEach(item => {
              zutaten[item.payload.doc.id] = item.payload.doc.data();
            });

            rezept = {
              ersteller: Object.values(element.data())[0],
              id: element.id,
              inhalte: inhalte,
              zutaten: zutaten
            }

            rezepte.push(
              new Rezept().deserialize(rezept)
            );

            inhalte = {};
            zutaten = {};
          });
        });
      });
    });

    return rezepte;
  }

  getRezepteByName(name: Array<string>): Array<Rezept> {
    let rezepte: Array<Rezept> = [];

    name.forEach(async item => {
      rezepte.push(await this.getRezeptByName(item));
    });

    return rezepte;
  } // Filtermöglichkeiten hier hinzufügen

  getRezeptByName(name: string): Promise<Rezept> {
    let returnRezept: Rezept;
    let rezept, inhalte, zutaten;

    return new Promise(resolve => {
      // Get alle Werte aus dem übergebenen Document
      this.firestore.collection("Rezepte").doc(name).snapshotChanges().subscribe(res => {
        this.getInhalteFuerRezept(name).subscribe(resIn => {
          this.getZutatenFuerRezept(name).subscribe(resZut => {

            inhalte = {};
            zutaten = {};

            resIn.forEach(item => {
              inhalte[item.payload.doc.id] = item.payload.doc.data();
            });

            resZut.forEach(item => {
              zutaten[item.payload.doc.id] = item.payload.doc.data();
            });

            rezept = res.payload.data();
            rezept["inhalte"] = inhalte;
            rezept["zutaten"] = zutaten;

            returnRezept = (new Rezept().deserialize({
              ersteller: res.payload.data()["Ersteller"],
              id: res.payload.data()["id"],
              inhalte: inhalte,
              zutaten: zutaten
            }));



            resolve(returnRezept);
          });
        });
      });
    });
  }

  getInhalteFuerRezept(name: string): Observable<any> {
    // Get Collection "Inhalte" aus dem übergebenen Document
    return this.firestore.collection("Rezepte").doc(name).collection("Inhalte").snapshotChanges();
  }

  getZutatenFuerRezept(name: string): Observable<any> {
    // Get Collection "Zutaten" aus dem übergebenen Document
    return this.firestore.collection("Rezepte").doc(name).collection("Zutaten").snapshotChanges();
  }

  createZutat(name: string, einheit: string, kalorien: number) { }
  getZutat(name: string) { }
  getZutaten(name: Array<string>) { }
  getAlleZutaten() { }

  setFavorit(rezeptName: string, userId: string) { }
  getAlleFavoriten(userId: string) { }
}
