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
/**
 * Autor: Anika Haushälter und Adrian Przybilla
 */
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

  /**
   * @ignore
   * @param firestore 
   * @param logger 
   * @param fileStorage 
   */
  constructor(
    private firestore: AngularFirestore,
    private logger: HelperService,
    private fileStorage: FileStorageService
  ) { }

  /**
   * Autor: Adrian Przybilla
   * 
   * SnapshotChanges haben unterschiedliche Types. Je nachdem welcher Typ übergeben wird, wird das neue Objekt dem Array hinzugefuegt, gelöscht oder überschreibt einen Index
   * @param type Snapshot-Type, welcher aussagt, ob das neue Item aufgenommen werden soll oder nicht
   * @param arr Array, dem ein Wert hinzugefügt werden soll
   * @param neuesObject Neues Object, welches eventuell dem Array hinzugefügt werden soll oder ein aktuelles Object überschreiben soll
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
   * Autor: Adrian Przybilla
   * 
   * Datenbankabfrage aller Rezepte
   * @returns Array mit allen Rezepten der Datenbank
   */
  getAlleRezepte(): Array<Rezept> {
    let rezepte: Array<Rezept> = [];
    let rezept: Rezept;

    // Anfrage der kompletten Rezept-Collection. SnapshotChanges-Anfrage schickt sofort aktualisierungen der Datenbank
    this.firestore.collection(this.collections.rezepte).snapshotChanges().subscribe(res => {
      //Überprüfen, ob Objekte aus der Datenbank entfernt wurden
      if(rezepte.length>res.length){
        let includes = false;
        rezepte.forEach(item => {
          includes = false;
          for(let i = 0; i< res.length; i++) {
            if(item.id == res[i].payload.doc.id){
              includes = true;
              break;
            }
          }
          if(!includes) {
            this.arraySnapshotBearbeiten("removed", rezepte, item);

          }
        })
      }
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
            if(rezepte.includes(rezept)){
              this.arraySnapshotBearbeiten("modified", rezepte, rezept);
            } else {
              this.arraySnapshotBearbeiten(ele.type, rezepte, rezept);
            }
          });
        });
      });
    });

    return rezepte;
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Liest alle Rezept-Ids aus und gibt sie als Array zurück
   * @returns Alle Rezept-Ids in der Firestore-Collection "Rezepte"
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
   * Autor: Adrian Przybilla
   * 
   * Abfrage einer beliebigen Anzahl an Rezepten
   * @param names Multidimensionales Array. Array-Aufbau beispielhaft erklärt:
   *  [["Feld-Id, wie in Rezept-Model", "Wert1", "Wert2"],
   *  ["Feld-Id, wie in Rezept-Model", "Wert1", "Wert2"]]
   * @returns angefragte Rezepte
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
   * Autor: Adrian Przybilla
   * 
   * Liest einzelnes Rezept aus
   * @param name Rezept-Id
   * @returns Rezept-Object
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
   * Autor: Adrian Przybilla
   * 
   * Neues Rezept erstellen oder vorhandenes Rezept überschreiben
   * @param rezept Rezept-Object
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
   * Autor: Adrian Przybilla
   * 
   * Einzelne Rezepte löschen
   * @param id Rezept-Id
   */
  deleteRezept(id: string): void {
    //Bild löschen
    this.fileStorage.removeRezeptFile(id).then(() => {
      this.logger.logging(`${id}-Bild gelöscht.`);
    }).catch(e => {
      this.logger.logging(`${id}-Bild konnte nicht gelöscht werden: ${e}`);
    });

    //Inhalte löschen
    this.firestore.collection(`${this.collections.rezepte}/${id}/inhalte`).ref.get().then((inhalte) => {

      inhalte.forEach(inhalt => {
        inhalt.ref.delete();
      });

    });

    //Zutaten löschen
    this.firestore.collection(`${this.collections.rezepte}/${id}/zutaten`).ref.get().then((zutaten) => {

      zutaten.forEach(zutat => {
        zutat.ref.delete();
      });

    });

    //Parent löschen
    this.firestore.doc(`${this.collections.rezepte}/${id}`).delete().then(() => {
      this.logger.logging(`${id}-Parent gelöscht.`);
    }).catch(e => {
      this.logger.logging(`${id}-Parent konnte nicht gelöscht werden: ${e}`);
    });

    // Rezept aus "eigeneRezepte"-Array in dem User löschen
    let userId = localStorage.getItem("user");
    this.firestore.doc(`${this.collections.user}/${userId}`).get().toPromise().then((res) => {
      let rezepte = res.data()["eigeneRezepte"].filter(data => data != id);
      this.firestore.doc(`${this.collections.user}/${userId}`).update({
        eigeneRezepte: rezepte
      });
    })

  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Alle User erhalten
   * @returns Array mit allen Usern als User-Object
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
   * Autor: Adrian Przybilla
   * 
   * Beliebige Anzahl an Usern anfragen
   * @param names gewünschte User-Ids
   * @returns Array mit allen angefragten Usern als User-Object
   */
  getUsers(names: Array<string>): Array<User> {
    let user: Array<User> = new Array<User>();

    names.forEach(item => {
      user.push(this.getUser(item));
    });

    return user;
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Einzelnen User anfragen
   * @param name User-Id
   * @returns User-Object
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
   * Autor: Adrian Przybilla
   * 
   * Neuen User setzen oder User überschreiben
   * @param user User-Object
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
   * Autor: Anika Haushälter
   * 
   * Speichert eine Notiz, die ein User erstellt. Wenn das Rezept nicht in der Collection Individuelle Angaben ist, wird es hinzugefügt
   * @param rezeptName {string} RezeptID, für das die Notiz ist
   * @param userId {string} ID des Users, der eine Notiz speichert
   * @param notiz {string} String, der als Notiz gespeichert werden soll
   */
  setNotiz(rezeptName: string, userId: string, notiz: string) {
    this.firestore.doc(`${this.collections.user}/${userId}/${this.collections.nutzerangaben}/${rezeptName}`).set({
      notizen: notiz
    }, { merge: true })
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Alle Zutaten anfragen
   * @returns Array aus Zutat-Objects
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
   * Autor: Adrian Przybilla
   * 
   * Alle Zutaten anfragen
   * @returns Object aus Zutat-Objects
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
   * Autor: Adrian Przybilla
   * 
   * Erhalte beliebig viele Zutaten
   * @param names 
   * @returns Array aus Zutat-Objects
   */
  getZutaten(names: Array<string>): Array<Zutat> {
    let zutat: Array<Zutat> = [];

    names.forEach(item => {
      zutat.push(this.getZutat(item));
    });

    return zutat;
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Erhalte einzelne Zutat
   * @param name zutat-Id
   * @returns Zutat-Object
   */
  getZutat(name: string): Zutat {
    let zutat: Zutat = new Zutat();

    this.firestore.collection(this.collections.zutaten).doc(name).snapshotChanges().subscribe(res => {
      zutat = zutat.deserialize(res.payload.data());
    });

    return zutat;
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Erstelle neue Zutat oder überschreibe existierende Zutat
   * @param zutat Zutat-Object
   */
  setZutat(zutat: Zutat): void {
    this.firestore.collection(this.collections.zutaten).doc(zutat.id).set(JSON.parse(JSON.stringify(zutat)));
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Füge Favorit dem Array hinzu
   * @param rezeptName Rezept-Id
   * @param userId user-uid
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
   * Autor: Adrian Przybilla
   * 
   * Entfernt ein Favorit aus dem Array
   * @param rezeptName Rezept-id
   * @param userId user-id
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
   * Autor: Adrian Przybilla
   * 
   * Gibt alle favorisierten Rezepte in einem Array als Promise zurück
   * @param userId 
   * @returns Promise mit Array aus Rezept-Objects
   */
  async getAlleFavoriten(userId: string): Promise<Array<Rezept>> {
    let returnVal: Array<Rezept> = [];

    let favoritenPromise = await this.firestore.doc(`${this.collections.user}/${userId}`).snapshotChanges().pipe(first()).toPromise();
    let liste = ["id"].concat(favoritenPromise.payload.data()["favoriten"]);

    returnVal = this.getRezepte([liste]);

    return returnVal;
  }

  /**
   * Autor: Anika Haushälter
   * 
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
   * Autor: Anika Haushälter
   */
  getKochbuch(buchName: string): Kochbuch {
    let kochbuch: Kochbuch = new Kochbuch();
    this.firestore.collection(this.collections.kochbuecher).doc(buchName).snapshotChanges().subscribe(res => {
      kochbuch = kochbuch.deserialize(res.payload.data());
    })

    return kochbuch;
  }

  /**
   * Autor: Anika Haushälter
   * 
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
   * Autor: Anika Haushälter
   * 
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
   * Autor: Adrian Przybilla
   * 
   * Setzen einer Bewertung eines Users
   * @param bewertung Nummer, die gesetzt wurde
   * @param user User, der bewertet
   * @param rezeptId Rezept, welches bewertet wurde
   */
  setBewertung(bewertung: number, user: User, rezeptId: string): Promise<any> {
    //Überprüfen, ob der User bereits eine Bewertung hatte
    let bewertungVorhanden: boolean = false;
    let alteBewertung = 0;

    if(user?.individuelleAngaben[rezeptId]?.bewertung){
      bewertungVorhanden = true;
      alteBewertung = user.individuelleAngaben[rezeptId].bewertung;
    }

    //neue durchschnittliche Bewertung berechnen
    let durchschnittlicheBewertung;
    let anzahl;

      this.firestore.doc(`${this.collections.rezepte}/${rezeptId}/${this.collections.rezeptinhalte}/bewertung`).get().toPromise().then(res => {
        anzahl = res.data()["anzahl"];
        durchschnittlicheBewertung = res.data()["bewertung"] * res.data()["anzahl"];

        //bei Bedarf Anzahl der Bewertungen erhöhen
        if (!bewertungVorhanden) {
          ++anzahl;
        }

        //neue durchschnittliche Bewertung berechnen
        durchschnittlicheBewertung = durchschnittlicheBewertung - alteBewertung + bewertung;

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
        return this.firestore.doc(`${this.collections.user}/${user.id}/${this.collections.nutzerangaben}/${rezeptId}`).set(JSON.parse(JSON.stringify(rezeptReferenz)));

      });

      return new Promise((resolve, reject) => {
        resolve("Text und so");
      });

  }
}
