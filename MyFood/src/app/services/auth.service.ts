import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../models/user/user.model';
import { FirebaseService } from './firebase.service';
import { HelperService } from "./helper.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private aktuellerUser;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private logging: HelperService,
    private firebase: FirebaseService
  ) {
    this.checkAuthState();
  }

  /**
   * Überprüft den Status des aktuellen Users.
   * Autor: Anika Haushälter & Adrian Przybilla
   */
  checkAuthState() {
    this.auth.onAuthStateChanged(user => {
      this.setAktuellerUser(user);
      if (user) {
        localStorage.setItem('user', user.uid);
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  /**
   * Prüft, ob ein User eingeloggt ist
   * @returns true bei eingeloggtem User
   * Autor: Adrian Przybilla
   */
  isLoggedIn() {
    return (this.aktuellerUser) ? true : false;
  }

  /**
   * Registrierung, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   * @param passwort 
   */
  registrieren(email, passwort) {
    this.auth.createUserWithEmailAndPassword(email, passwort).then((res) => {
      this.logging.logging("Registrierung durchgeführt.");
      let userModel = new User().deserialize({
        id: res.user.uid,
        favoriten: [],
        eigeneRezepte: []
      });
      this.firebase.setUser(userModel);
      this.login(email, passwort);
    }).catch(e => {
      switch (e.code) {
        case "auth/email-already-in-use":
          this.logging.zeigeToast("E-Mail bereits vergeben.");
          break;
        case "auth/invalid-email":
          this.logging.zeigeToast("Invalide E-Mail");
          break;
        case "auth/operation-not-allowed":
          this.logging.zeigeToast("Operation nicht erlaubt.");
          break;
        case "auth/weak-password":
          this.logging.zeigeToast("Passwort zu schwach. Mindestens 6 Zeichen benötigt.");
          break;
        case "auth/email-already-in-use":
          this.logging.zeigeToast("E-Mail bereits vergeben.");
          break;
        default:
          this.logging.zeigeToast("Unbekannter Fehler.");
          this.logging.logging(e);
      }
      this.logging.logging("Fehler-Code: " + e.code + "; E-Mail: " + email);
    });
  }

  /**
   * Login, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   * @param passwort 
   * Autor: Adrian Przybilla
   */
  login(email, passwort) {
    this.auth.signInWithEmailAndPassword(email, passwort).then((res) => {
      this.logging.logging("Nutzer eingeloggt.");
      //Anzeigen von footer
      document.getElementById("footer").style.display = "block";
      this.router.navigateByUrl("/home");
    }).catch(e => {
      switch (e.code) {
        case "auth/invalid-email":
          this.logging.zeigeToast("Invalide E-Mail.");
          break;
        case "auth/user-disabled":
          this.logging.zeigeToast("Nutzer deaktiviert");
          break;
        case "auth/too-many-requests":
          this.logging.zeigeToast("Zu viele Anfragen, bitte versuchen Sie es später erneut.");
          break;
        case "auth/wrong-password":
          this.logging.zeigeToast("Falsches Passwort.");
          break;
        case "auth/user-not-found":
          this.logging.zeigeToast("User wurde nicht gefunden");
          break;
        default:
          this.logging.zeigeToast("Es ist ein Fehler aufgetreten.");
          this.logging.logging("Anmeldefehler. Fehlercode noch nicht als Case hinzugefügt.");
      }
      this.logging.logging("Fehler-Code: " + e.code + "; E-Mail: " + email);
    });
  }

  /**
   * Passwort zurücksetzen, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   * Autor: Adrian Przybilla
   */
  passwortVergessen(email, altesPasswort, neuesPasswort) {
    this.auth.signInWithEmailAndPassword(email, altesPasswort).then(() => {
      this.auth.user.subscribe(user => {
        user.updatePassword(neuesPasswort);
      });
    }).catch(e => {
      switch (e.code) {
        case "auth/invalid-email":
          this.logging.zeigeToast("Invalide E-Mail.");
          break;
        case "auth/user-disabled":
          this.logging.zeigeToast("Nutzer deaktiviert");
          break;
        case "auth/too-many-requests":
          this.logging.zeigeToast("Zu viele Anfragen, bitte versuchen Sie es später erneut.");
          break;
        case "auth/wrong-password":
          this.logging.zeigeToast("Falsches Passwort.");
          break;
        case "auth/user-not-found":
          this.logging.zeigeToast("User wurde nicht gefunden");
          break;
        default:
          this.logging.zeigeToast("Es ist ein Fehler aufgetreten.");
          this.logging.logging("Anmeldefehler. Fehlercode noch nicht als Case hinzugefügt.");
      }
      this.logging.logging("Fehler-Code: " + e.code + "; E-Mail: " + email);
    });
  }

  /**
   * Ausloggen des aktuell angemeldeten User
   * Autor: Adrian Przybilla
   */
  logout() {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl("/login");
    }).catch(e => {
      this.logging.logging(e);
    });
  }

  /**
   * Set-Methode für aktuellerUser
   * @param user 
   * Autor: Adrian Przybilla
   */
  private setAktuellerUser(user: object): void {
    this.aktuellerUser = user;
  }

  /**
   * Get-Methode für aktuellerUser
   * @returns aktuellerUser als Object
   * Autor: Adrian Przybilla
   */
  getAktuellerUser() {
    return this.aktuellerUser;
  }
}
