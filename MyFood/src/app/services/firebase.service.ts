import { templateJitUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Kochbuch } from '../models/kochbuecher/kochbuch';
import { Rezept } from "../models/rezepte/rezept.model";
import { User } from '../models/user/user.model';
import { Zutat } from '../models/zutaten/zutat.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService
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

  getAlleRezeptIds(): Array<string> {
    let names: Array<string> = new Array<string>();

    this.firestore.collection("Rezepte").ref.get().then(res => {
      res.docs.forEach(ele => {
        names.push(ele.data()["id"]);
      });
    });

    return names;
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
            ersteller: res.payload.data()["ersteller"],
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
    // Get Collection "inhalte" aus dem übergebenen Document
    return this.firestore.collection("Rezepte").doc(name).collection("inhalte").snapshotChanges();
  }

  getZutatenFuerRezept(name: string): Observable<any> {
    // Get Collection "zutaten" aus dem übergebenen Document
    return this.firestore.collection("Rezepte").doc(name).collection("zutaten").snapshotChanges();
  }

  setRezept(rezept: Rezept): void {
    this.firestore.collection("Rezepte").doc(rezept.id).set({
      ersteller: rezept.ersteller,
      id: rezept.id
    });

    for (let item in rezept.inhalte) {
      this.firestore.collection("Rezepte").doc(rezept.id).collection("inhalte").doc(item).set(
        JSON.parse(JSON.stringify(rezept.inhalte[item]))
      );
    }

    for (let item in rezept.zutaten) {
      this.firestore.collection("Rezepte").doc(rezept.id).collection("zutaten").doc(item).set(
        JSON.parse(JSON.stringify(rezept.zutaten[item]))
      );
    }
  }

  deleteRezept(id: string): void {
    //this.firestore.
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
      if (res.payload.data() !== undefined) {
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
      }
    });

    return user;
  }

  setUser(user: User): void {
    this.firestore.collection("User").doc(user.id).set({
      id: user.id,
      favoriten: user.favoriten,
      eigeneRezepte: user.eigeneRezepte
    });

    for (let item in user.individuelleAngaben) {
      this.firestore.collection("User").doc(user.id).collection("Individuelle Angaben").doc(item).set(
        JSON.parse(JSON.stringify(user.individuelleAngaben[item]))
      );
    }
  }

  getAlleZutaten(): Array<Zutat> {
    let temp, user: Array<Zutat> = [];

    this.firestore.collection("zutaten").get().subscribe(res => {
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

  setZutat(zutat: Zutat): void {
    this.firestore.collection("zutaten").doc(zutat.id).set(zutat);
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

  getAlleFavoriten(userId: string): Array<Rezept> {
    let returnVal: Array<Rezept>;

    this.firestore.collection("User").doc(userId).snapshotChanges().subscribe(res => {
      returnVal = this.getRezepte(res.payload["favoriten"]);
    });

    return returnVal;
  }

  /**
   * Speichern eines neuen Kochbuches
   * @param kochbuch Zu speicherndes Kochbuch als Typ Kochbuch
   */
  setKochbuch(kochbuch: Kochbuch):void{
    this.firestore.collection("kochbuecher").doc(kochbuch.id).set(JSON.parse(JSON.stringify(kochbuch)));
  }

  /**
   * Aufrufen eines Kochbuches
   * @param buchName string mit Name des gewünschten Kochbuches
   * @returns gesuchtes Kochbuch
   */
  getKochbuch(buchName:string):Kochbuch{
    let kochbuch: Kochbuch = new Kochbuch();
    this.firestore.collection("kochbuecher").doc(buchName).snapshotChanges().subscribe(res =>{
      kochbuch = kochbuch.deserialize(res.payload.data());
    })

    return kochbuch;
  }

  /**
   * Aufrufen aller Kochbücher
   * @returns Liste aller Kochbücher
   */
  getAlleKochbuecher(): Array<Kochbuch> {
    let kochbuecher: Array<Kochbuch> = [];

    this.firestore.collection("kochbuecher").get().subscribe(res => {
      res.docs.forEach(element => {
        kochbuecher.push(new Kochbuch().deserialize(element.data()));
      });
    });

    return kochbuecher;
  }

  /**
   * Aufrufen mehrere Kochbücher durch Namen
   * @param names Array mit strings der Namen der gewünschten Kochbücher
   * @returns Liste der gewünschten Bücher
   */
  getKochbuecher(names: Array<string>): Array<Kochbuch> {
    let zutat: Array<Kochbuch> = [];

    names.forEach(item => {
      zutat.push(this.getKochbuch(item));
    });

    return zutat;
  }
}
