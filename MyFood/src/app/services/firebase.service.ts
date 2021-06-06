import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Kochbuch } from '../models/kochbuecher/kochbuch';
import { Rezept } from '../models/rezepte/rezept.model';
import { User } from '../models/user/user.model';
import { Zutat } from '../models/zutaten/zutat.model';
import { ZutatReferenz } from "../models/rezepte/zutat-referenz.model";
import { Inhalte } from '../models/rezepte/inhalte.model';
import { IndividuelleAngaben } from '../models/user/individuelle-angaben.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  //unveränderliche Konstante mit den Namen der Collections
  readonly collections = {
    kochbuecher: "kochbucher",
    rezepte: "Rezepte",
    rezeptinhalte: "inhalte",
    user: "user",
    nutzerangaben: "individuelle Angaben",
    zutaten: "zgutaten"
  }

  constructor(
    private firestore: AngularFirestore
  ) { }

  /**
   * SnapshotChanges haben unterschiedliche Types. Je nachdem welcher Typ übergeben wird, wird das neue Objekt dem Array hinzugefuegt, gelöscht oder überschreibt einen Index
   * @param type 
   * @param arr 
   * @param neu 
   */
  arraySnapshotBearbeiten(type: string , arr: Array<any>, neuesObject: any){
    if(type == "added"){
      arr.push(neuesObject);
    } else if(type == "modified") {
      for (let i = 0; i < arr.length; i++) {
        if (neuesObject.id == arr[i].id) {
          arr[i] = neuesObject;
          break;
        }
      }
    } else if(type == "removed") {
      for (let i = 0; i < arr.length; i++) {
        if (neuesObject.id == arr[i].id) {
          arr.splice(i, 1);
          break;
        }
      }
    } else {
      // unbekannter Type
    }
  }

  /**
   * Datenbankabfrage aller Rezepte
   * @returns Array mit allen Rezepten der Datenbank
   */
  getAlleRezepte(): Array<Rezept> {
    let rezepte: Array<Rezept> = [];
    let rezept: Rezept;

    // Anfrage der kompletten Rezept-Collection. SnapshotChanges-Anfrage schickt sofort aktualisierungen der Datenbank
    this.firestore.collection(this.collections.rezepte).snapshotChanges().subscribe(res => {
      res.forEach(ele => {
        // Nested Collections werden gezielt angefragt. Get-Anfrage damit Daten nur einmal erhalten werden
        this.firestore.collection(`${this.collections.rezepte}/${ele.payload.doc.id}/${this.collections.rezeptinhalte}`).get().subscribe(resInhalte => {
          this.firestore.collection(`${this.collections.rezepte}/${ele.payload.doc.id}/${this.collections.zutaten}`).get().subscribe(resZutaten => {

            // Erstellen einzelner Rezepte
            rezept = new Rezept().deserialize(ele.payload.doc.data());

            rezept.inhalte = new Inhalte();
            resInhalte.forEach(item => {
              rezept.inhalte[item.id] = item.data();
            })

            resZutaten.forEach(item => {
              rezept.zutaten[item.id] = new ZutatReferenz().deserialize(item.data());
            });

            // Wert je nach Type dem Array hinzufügen, löschen oder überschreiben lassen
            this.arraySnapshotBearbeiten(ele.type, rezepte, rezept);
          });
        });
      });
    });

    return rezepte;
  }

  /**
   * Liest alle Rezept-Ids aus und gibt sie als Array zurück
   * @returns 
   */
  getAlleRezeptIds(): Array<string> {
    let names: Array<string> = [];

    this.firestore.collection(this.collections.rezepte).ref.get().then(res => {
      res.docs.forEach(ele => {
        names.push(ele.data()["id"]);
      });
    });

    return names;
  }

  /**
   * Abfrage einer beliebigen Anzahl an Rezepten
   * @param names Array<string>
   * @returns 
   */
  getRezepte(names: Array<string>): Array<Rezept> {
    let rezepte: Array<Rezept> = [];

    names.forEach(item => {
      rezepte.push(this.getRezept(item));
    });

    return rezepte;
  }

  /**
   * Liest einzelnes Rezept aus
   * @param name 
   * @returns 
   */
  getRezept(name: string): Rezept {
    let rezept: Rezept = new Rezept();

    // Get alle Werte aus dem übergebenen Document
    this.firestore.doc(`${this.collections.rezepte}/${name}`).snapshotChanges().subscribe(res => {
      // Nested Collections mit Get-Anfrage für einmaliges auslesen anfragen
      this.firestore.collection(`${this.collections.rezepte}/${name}/${this.collections.rezeptinhalte}`).get().subscribe(resInhalte => {
        this.firestore.collection(`${this.collections.rezepte}/${name}/${this.collections.zutaten}`).get().subscribe(resZutaten => {

          rezept.deserialize(res.payload.data());

          rezept.inhalte = new Inhalte();
          resInhalte.forEach(item => {
            rezept.inhalte[item.id] = item.data();
          });

          resZutaten.forEach(item => {
            rezept.zutaten[item.id] = new ZutatReferenz().deserialize(item.data());
          });
        });
      });
    });

    return rezept;
  }

  /**
   * Neues Rezept erstellen oder vorhandenes Rezept überschreiben
   * @param rezept 
   */
  setRezept(rezept: Rezept): void {
    // Rezept setzen
    this.firestore.collection(this.collections.rezepte).doc(rezept.id).set({
      ersteller: rezept.ersteller,
      id: rezept.id
    });

    // Nested Documents setzen
    for (let item in rezept.inhalte) {
      this.firestore.doc(`${this.collections.rezepte}/${rezept.id}/${this.collections.rezeptinhalte}/${item}`).set(
        JSON.parse(JSON.stringify(rezept.inhalte[item]))
      );
    }

    // Nested Documents setzen
    for (let item in rezept.zutaten) {
      this.firestore.doc(`${this.collections.rezepte}/${rezept.id}/${this.collections.zutaten}/${item}`).set(
        JSON.parse(JSON.stringify(rezept.zutaten[item]))
      );
    }
  }

  /**
   * Einzelne Rezepte löschen
   * @param id 
   */
  deleteRezept(id: string): void {
    //this.firestore.
  }

  /**
   * Alle User erhalten
   * @returns 
   */
  getAlleUser(): Array<User> {
    let user: User, users: Array<User> = [];

    this.firestore.collection(this.collections.user).snapshotChanges().subscribe(res => {
      res.forEach(ele => {
        this.firestore.collection(`${this.collections.user}/${ele.payload.doc.id}/${this.collections.nutzerangaben}`).get().subscribe(resIA => {
          //this.firestore.collection(this.collections.user).doc(element.id).collection(this.collections.nutzerangaben).snapshotChanges().subscribe(resIA => {

          user = new User().deserialize(ele.payload.doc.data());

          user.individuelleAngaben = new IndividuelleAngaben();
          resIA.forEach(item => {
            user.individuelleAngaben[item.id] = item.data();
          });

          // Wert je nach Type dem Array hinzufügen, löschen oder überschreiben lassen
          this.arraySnapshotBearbeiten(ele.type, users, user);

        });
      });
    });

    return users;
  }

  /**
   * Beliebige Anzahl an Usern anfragen
   * @param names 
   * @returns 
   */
  getUsers(names: Array<string>): Array<User> {
    let user: Array<User> = new Array<User>();

    names.forEach(item => {
      user.push(this.getUser(item));
    });

    return user;
  }

  /**
   * Einzelnen User anfragen
   * @param name 
   * @returns
   */
  getUser(name: string): User {
    let user: User = new User();

    this.firestore.doc(`${this.collections.user}/${name}`).snapshotChanges().subscribe(res => {
      if (res.payload.data() !== undefined) {
        this.firestore.collection(`${this.collections.user}/${name}/${this.collections.nutzerangaben}`).get().subscribe(resIA => {

          user.deserialize(res.payload.data());

          user.individuelleAngaben = new IndividuelleAngaben();
          resIA.forEach(item => {
            user.individuelleAngaben[item.id] = item.data();
          });
        });
      }
    });

    return user;
  }

  /**
   * Neuen User setzen oder User überschreiben
   * @param user 
   */
  setUser(user: User): void {
    this.firestore.doc(`${this.collections.user}/${user.id}`).set({
      id: user.id,
      favoriten: user.favoriten,
      eigeneRezepte: user.eigeneRezepte
    });

    for (let item in user.individuelleAngaben) {
      this.firestore.doc(`${this.collections.user}/${user.id}/${this.collections.nutzerangaben}/${item}`).set(
        JSON.parse(JSON.stringify(user.individuelleAngaben[item]))
      );
    }
  }

  /**
   * Alle Zutaten anfragen
   * @returns 
   */
  getAlleZutaten(): Array<Zutat> {
    let zutaten: Array<Zutat> = [];

    this.firestore.collection(this.collections.zutaten).snapshotChanges().subscribe(res => {
      res.forEach(ele => {      
        // Wert je nach Type dem Array hinzufügen, löschen oder überschreiben lassen
        this.arraySnapshotBearbeiten(ele.type, zutaten, new Zutat().deserialize(ele.payload.doc.data()));
      })
    });

    return zutaten;
  }

  /**
   * Erhalte beliebig viele Zutaten
   * @param names 
   * @returns 
   */
  getZutaten(names: Array<string>): Array<Zutat> {
    let zutat: Array<Zutat> = [];

    names.forEach(item => {
      zutat.push(this.getZutat(item));
    });

    return zutat;
  }

  /**
   * Erhalte einzelne Zutat
   * @param name 
   * @returns 
   */
  getZutat(name: string): Zutat {
    let zutat: Zutat = new Zutat();

    this.firestore.collection(this.collections.zutaten).doc(name).snapshotChanges().subscribe(res => {
      zutat = zutat.deserialize(res.payload.data());
    });

    return zutat;
  }

  /**
   * Erstelle neue Zutat oder überschreibe existierende Zutat
   * @param zutat 
   */
  setZutat(zutat: Zutat): void {
    this.firestore.collection(this.collections.zutaten).doc(zutat.id).set(zutat);
  }

  /**
   * Füge Favorit dem Array hinzu
   * @param rezeptName 
   * @param userId 
   */
  setFavorit(rezeptName: string, userId: string) {
    let favoritenArr: Array<string>;

    this.firestore.collection(this.collections.user).doc(userId).snapshotChanges().subscribe(res => {
      favoritenArr = res.payload["favoriten"];
      favoritenArr.push(rezeptName);

      this.firestore.collection(this.collections.user).doc(userId).update({
        favoriten: favoritenArr
      });
    });
  }

  /**
   * Erhalte alle Favoriten eines User
   * @param userId 
   * @returns 
   */
  getAlleFavoriten(userId: string): Array<Rezept> {
    let returnVal: Array<Rezept>;

    this.firestore.collection(this.collections.user).doc(userId).snapshotChanges().subscribe(res => {
      if (res.payload.data()["favoriten"] != undefined) {
        returnVal = this.getRezepte(res.payload.data()["favoriten"]);
      }
    });

    return returnVal;
  }

  /**
   * Speichern eines neuen Kochbuches
   * @param kochbuch Zu speicherndes Kochbuch als Typ Kochbuch
   */
  setKochbuch(kochbuch: Kochbuch): void {
    this.firestore.collection(this.collections.kochbuecher).doc(kochbuch.id).set(JSON.parse(JSON.stringify(kochbuch)));
  }

  /**
   * Aufrufen eines Kochbuches
   * @param buchName string mit Name des gewünschten Kochbuches
   * @returns gesuchtes Kochbuch
   */
  getKochbuch(buchName: string): Kochbuch {
    let kochbuch: Kochbuch = new Kochbuch();
    this.firestore.collection(this.collections.kochbuecher).doc(buchName).snapshotChanges().subscribe(res => {
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

    this.firestore.collection(this.collections.kochbuecher).snapshotChanges().subscribe(res => {
      res.forEach(element => {
        // Wert je nach Type dem Array hinzufügen, löschen oder überschreiben lassen
        this.arraySnapshotBearbeiten(element.type, kochbuecher, new Kochbuch().deserialize(element.payload.doc.data()));
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
