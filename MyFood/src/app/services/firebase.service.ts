import { templateJitUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Rezept } from "../models/rezepte/rezept.model";
import { User } from '../models/User/user.model';
import { Zutat } from '../models/Zutaten/zutat.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getAlleRezepte(): Array<Rezept> {
    let inhalte, zutaten, rezepte: Array<Rezept> = [];

    this.firestore.collection("Rezepte").get().subscribe(res => {
      res.docs.forEach(element => {
        this.getInhalteFuerRezept(element.id).subscribe(resIn => {
          this.getZutatenFuerRezept(element.id).subscribe(resZut => {

            inhalte = {};
            zutaten = {};

            resIn.forEach(item => {
              inhalte[item.payload.doc.id] = item.payload.doc.data();
            });

            resZut.forEach(item => {
              zutaten[item.payload.doc.id] = item.payload.doc.data();
            });

            rezepte.push(
              new Rezept().deserialize({
                ersteller: Object.values(element.data())[0],
                id: element.id,
                inhalte: inhalte,
                zutaten: zutaten
              })
            );

          });
        });
      });
    });

    return rezepte;
  }

  getRezepte(names: Array<string>): Array<Rezept> {
    let rezepte: Array<Rezept> = [];

    names.forEach(item => {
      rezepte.push(this.getRezept(item));
    });

    return rezepte;
  } // Filtermöglichkeiten hier hinzufügen

  getRezept(name: string): Rezept {
    let inhalte, zutaten, rezept = new Rezept();

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

          rezept = rezept.deserialize({
            ersteller: res.payload.data()["Ersteller"],
            id: res.payload.data()["id"],
            inhalte: inhalte,
            zutaten: zutaten
          });
        });
      });
    });

    return rezept;
  }

  getInhalteFuerRezept(name: string): Observable<any> {
    // Get Collection "Inhalte" aus dem übergebenen Document
    return this.firestore.collection("Rezepte").doc(name).collection("Inhalte").snapshotChanges();
  }

  getZutatenFuerRezept(name: string): Observable<any> {
    // Get Collection "Zutaten" aus dem übergebenen Document
    return this.firestore.collection("Rezepte").doc(name).collection("Zutaten").snapshotChanges();
  }

  getAlleUser(): Array<User> {
    let temp, user: Array<User> = [];

    this.firestore.collection("User").get().subscribe(res => {
      res.docs.forEach(element => {
        this.firestore.collection("User").doc(element.id).collection("Individuelle Angaben").snapshotChanges().subscribe(resIA => {

          temp = {};

          resIA.forEach(item => {
            temp[item.payload.doc.id] = item.payload.doc.data();
          });

          user.push(
            new User().deserialize({
              id: element.id,
              eigeneRezept: element.data()["EigeneRezepte"],
              favoriten: element.data()["Favoriten"],
              individuelleAngaben: temp
            })
          );
        });
      });
    });

    return user;
  }

  getUsers(names: Array<string>): Array<User> {
    let user: Array<User> = [];

    names.forEach(item => {
      user.push(this.getUser(item));
    });

    return user;
  }

  getUser(name: string): User {
    let temp, user: User = new User();

    this.firestore.collection("User").doc(name).snapshotChanges().subscribe(res => {
      this.firestore.collection("User").doc(name).collection("Individuelle Angaben").snapshotChanges().subscribe(resIA => {

        temp = {};

        resIA.forEach(item => {
          temp[item.payload.doc.id] = item.payload.doc.data();
        });

        user = user.deserialize({
          id: res.payload.id,
          eigeneRezept: res.payload.data()["EigeneRezepte"],
          favoriten: res.payload.data()["Favoriten"],
          individuelleAngaben: temp
        });
      });
    });

    return user;
  }

  getAlleZutaten(): Array<Zutat> {
    let temp, user: Array<Zutat> = [];

    this.firestore.collection("Zutaten").get().subscribe(res => {
      res.docs.forEach(element => {

        temp = element.data();
        temp["id"] = element.id;

        user.push(new Zutat().deserialize(temp));

      });
    });

    return user;
  }

  getZutaten(names: Array<string>): Array<Zutat> {
    let zutat: Array<Zutat> = [];

    names.forEach(item => {
      zutat.push(this.getZutat(item));
    });

    return zutat;
  }

  getZutat(name: string): Zutat {
    let zutat: Zutat = new Zutat();

    this.firestore.collection("Zutaten").doc(name).snapshotChanges().subscribe(res => {
      zutat = zutat.deserialize(res.payload.data());
    });

    return zutat;
  }

  setRezept(rezept: Rezept): void {
    this.firestore.collection("Rezepte").doc(rezept.id).set(rezept);
  }
  setZutat(zutat: Zutat): void {
    this.firestore.collection("Zutaten").doc(zutat.id).set(zutat);
  }
  setFavorit(rezeptName: string, userId: string) {
    let favoritenArr: Array<string>;

    this.firestore.collection("User").doc(userId).snapshotChanges().subscribe(res => {
      favoritenArr = res.payload["favoriten"];
      favoritenArr.push(rezeptName);
      
      this.firestore.collection("User").doc(userId).update({
        favoriten: favoritenArr
      });
    });
  }

  getAlleFavoriten(userId: string): Array<string> {
    let returnVal: Array<string>;

    this.firestore.collection("User").doc(userId).snapshotChanges().subscribe(res => {
      returnVal = res.payload["favoriten"];
    });

    return returnVal;
  }
}
