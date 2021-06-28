import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Kochbuch } from '../models/kochbuecher/kochbuch';
import { Rezept } from '../models/rezepte/rezept.model';
import { User } from '../models/user/user.model';
import { Zutat } from '../models/zutaten/zutat.model';
import { ZutatReferenz } from "../models/rezepte/zutat-referenz.model";
import { Inhalte } from '../models/rezepte/inhalte.model';
import { IndividuelleAngaben } from '../models/user/individuelle-angaben.model';
import { first } from 'rxjs/operators';
import { RezeptReferenz } from '../models/user/rezept-referenz.model';
import { HelperService } from './helper.service';
import { FileStorageService } from './file-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  //unveränderliche Konstante mit den Namen der Collections
  readonly collections = {
    kochbuecher: "kochbucher",
    rezepte: "rezepte",
    rezeptinhalte: "inhalte",
    user: "user",
    nutzerangaben: "individuelle angaben",
    zutaten: "zutaten"
  }

  constructor(
    private firestore: AngularFirestore,
    private logger: HelperService,
    private fileStorage: FileStorageService
  ) { }

  /**
   * SnapshotChanges haben unterschiedliche Types. Je nachdem welcher Typ übergeben wird, wird das neue Objekt dem Array hinzugefuegt, gelöscht oder überschreibt einen Index
   * @param type 
   * @param arr 
   * @param neu 
   */
  arraySnapshotBearbeiten(type: string, arr: Array<any>, neuesObject: any) {
    if (type == "added") {
      arr.push(neuesObject);
    } else if (type == "modified") {
      for (let i = 0; i < arr.length; i++) {
        if (neuesObject.id == arr[i].id) {
          arr[i] = neuesObject;
          break;
        }
      }
    } else if (type == "removed") {
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

            rezept.zutaten = {};
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
   * @param names Multidimensionales Array. Array-Aufbau beispielhaft erklärt:
   *  [["Feld-Id, wie in Rezept-Model", "Wert1", "Wert2"],
   *  ["Feld-Id, wie in Rezept-Model", "Wert1", "Wert2"]]
   * @returns 
   */
  getRezepte(filter: string[][]): Array<Rezept> {
    let rezepte: Array<Rezept> = [];
    let rezept: Rezept;
    let filterBool: boolean;

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

            rezept.zutaten = {};
            resZutaten.forEach(item => {
              rezept.zutaten[item.id] = new ZutatReferenz().deserialize(item.data());
            });

            // Filter anwenden und herausfinden, ob das Rezept zurückgegeben werden darf.
            filterBool = false;
            for (let i = 0; i < filter.length; i++) {
              for (let j = 1; j < filter[i].length; j++) {
                if (rezept[filter[i][0]] == filter[i][j]) {
                  filterBool = true;
                }
              }
            }

            // Wert je nach Type dem Array hinzufügen, löschen oder überschreiben lassen
            if (filterBool) {
              this.arraySnapshotBearbeiten(ele.type, rezepte, rezept);
            }
          });
        });
      });
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

          rezept.zutaten = {};
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

    this.firestore.collection(this.collections.user).doc(rezept.ersteller).get().subscribe(res => {

      let eigeneArr = res.data()["eigeneRezepte"];
      if (eigeneArr.includes(rezept.id)) {
        return;
      } else {
        eigeneArr.push(rezept.id);
      }

      this.firestore.collection(this.collections.user).doc(rezept.ersteller).update({
        eigeneRezepte: eigeneArr
      });
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
    //Bild löschen
    this.fileStorage.removeRezeptFile(id).then(() => {      
      this.logger.logging(`${id}-Bild gelöscht.`);
    }).catch(e => {
      this.logger.logging(`${id}-Bild konnte nicht gelöscht werden: ${e}`);
    });

    //Inhalte löschen
    this.firestore.doc(`${this.collections.rezepte}/${id}`).delete().then(() => {
      this.logger.logging(`${id}-Inhalte gelöscht.`);
    }).catch(e => {
      this.logger.logging(`${id}-Inhalte konnte nicht gelöscht werden: ${e}`);
    });

    //Zutaten löschen
    this.firestore.doc(`${this.collections.rezepte}/${id}`).delete().then(() => {
      this.logger.logging(`${id}-Zutaten gelöscht.`);
    }).catch(e => {
      this.logger.logging(`${id}-Zutaten konnte nicht gelöscht werden: ${e}`);
    });

    //Parent löschen
    this.firestore.doc(`${this.collections.rezepte}/${id}`).delete().then(() => {
      this.logger.logging(`${id}-Parent gelöscht.`);
    }).catch(e => {
      this.logger.logging(`${id}-Parent konnte nicht gelöscht werden: ${e}`);
    });
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
   * Alle Zutaten anfragen
   * @returns 
   */
  getAlleZutatenAlsObject(): Object {
    let zutaten = {};
    let zutat: Zutat;
    let zutatJson;

    this.firestore.collection(this.collections.zutaten).snapshotChanges().subscribe(res => {
      res.forEach(ele => {
        zutat = new Zutat().deserialize(ele.payload.doc.data());
        zutaten[zutat.id] = zutat;
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

    this.firestore.collection(this.collections.user).doc(userId).get().subscribe(res => {

      favoritenArr = res.data()["favoriten"];
      if (favoritenArr.includes(rezeptName)) {
        return;
      } else {
        favoritenArr.push(rezeptName);
      }

      this.firestore.collection(this.collections.user).doc(userId).update({
        favoriten: favoritenArr
      });
    });
  }

  /**
   * Entfernt ein Favorit aus dem Array
   * @param rezeptName 
   * @param userId 
   */
  removeFavorit(rezeptName: string, userId: string) {
    let favoritenArr: Array<string>;

    this.firestore.collection(this.collections.user).doc(userId).get().subscribe(res => {

      favoritenArr = res.data()["favoriten"];
      if (!favoritenArr.includes(rezeptName)) {
        return;
      } else {
        favoritenArr.splice(favoritenArr.indexOf(rezeptName), 1);
      }

      this.firestore.collection(this.collections.user).doc(userId).update({
        favoriten: favoritenArr
      });
    });
  }

  /**
   * Gibt alle Rezepte in einem Array als Promise zurück
   * @param userId 
   * @returns Promise
   */
  async getAlleFavoriten(userId: string): Promise<Array<Rezept>> {
    let returnVal: Array<Rezept> = [];

    let favoritenPromise = await this.firestore.collection(this.collections.user).doc(userId).snapshotChanges().pipe(first()).toPromise();
    let liste = ["id"].concat(favoritenPromise.payload.data()["favoriten"]);

    returnVal = this.getRezepte([liste]);

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

  /**
   * Setzen einer Bewertung eines Users
   * @param bewertung Nummer, die gesetzt wurde
   * @param user User, der bewertet
   * @param rezeptId Rezept, welches bewertet wurde
   */
  setBewertung(bewertung: number, user: User, rezeptId: string) {
    //Überprüfen, ob der User bereits eine Bewertung hatte
    let vorhanden = false;
    let bewAlt = 0
    if (user.individuelleAngaben[rezeptId] != undefined) {
      if (user.individuelleAngaben[rezeptId].bewertung != undefined) {
        vorhanden = true;
        bewAlt = user.individuelleAngaben[rezeptId].bewertung;
      }
    }

    //neue durchschnittliche Bewertung berechnen
    let durchschnittlicheBewertung;
    let anzahl;

    this.firestore.doc(`${this.collections.rezepte}/${rezeptId}/${this.collections.rezeptinhalte}/bewertung`).get().subscribe(res => {
      anzahl = res.data()["anzahl"];
      durchschnittlicheBewertung = res.data()["bewertung"] * res.data()["anzahl"];

      //bei Bedarf Anzahl der Bewertungen erhöhen
      if (!vorhanden) {
        ++anzahl;
      }
      //neue durchschnittliche Bewertung berechnen
      durchschnittlicheBewertung = durchschnittlicheBewertung - bewAlt + bewertung;


      //neue Rezeptreferenz erstellen
      let rezeptReferenz: RezeptReferenz = new RezeptReferenz().deserialize({
        bewertung: bewertung
      });

      //updaten der durchschnittlichen Bewertung des Rezeptes
      this.firestore.doc(`${this.collections.rezepte}/${rezeptId}/${this.collections.rezeptinhalte}/bewertung`).set({
        bewertung: (durchschnittlicheBewertung / anzahl),
        anzahl: anzahl
      });

      //updaten des Users mit der neuen Bewertung (bei Bedarf wird das Dokument neu angelegt)
      this.firestore.doc(`${this.collections.user}/${user.id}/${this.collections.nutzerangaben}/${rezeptId}`).set(JSON.parse(JSON.stringify(rezeptReferenz)));

    });

  }
}
