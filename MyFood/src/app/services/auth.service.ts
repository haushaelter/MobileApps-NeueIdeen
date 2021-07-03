import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../models/user/user.model';
import { FirebaseService } from './firebase.service';
import { HelperService } from "./helper.service";


@Injectable({
  providedIn: 'root'
})
/**
 * Autor: Anika Haushälter und Adrian Przybilla
 */
export class AuthService {

  private aktuellerUser;

  /**
   * Autor: Adrian Przybilla
   * 
   * überprüft direkt den Status des aktuellen Users
   * @param auth 
   * @param router 
   * @param logging 
   * @param firebase 
   */
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private logging: HelperService,
    private firebase: FirebaseService
  ) {
    this.checkAuthState();
  }

  /**
   * Autor: Anika Haushälter und Adrian Przybilla
   * 
   * Überprüft den Status des aktuellen Users.
   */
  private checkAuthState() {
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
   * Autor: Adrian Przybilla
   * 
   * Prüft, ob ein User eingeloggt ist
   * @returns true bei eingeloggtem User
   */
  isLoggedIn() {
    return (this.aktuellerUser) ? true : false;
  }

  /**
   * Autor: Adrian Przybilla 
   * 
   * Registrierung, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   * @param passwort 
   */
  registrieren(email, passwort) {
    this.auth.createUserWithEmailAndPassword(email, passwort).then((res) => {
      this.logging.logging("Registrierung durchgeführt.");
      //Anlegen des neuen Users in der Datenbank
      let userModel = new User().deserialize({
        id: res.user.uid,
        favoriten: [],
        eigeneRezepte: []
      });
      this.firebase.setUser(userModel);
      //Automatischer Login
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
   * Autor: Adrian Przybilla
   * 
   * Login, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   * @param passwort 
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
   * Autor: Adrian Przybilla
   * 
   * Passwort zurücksetzen, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
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
   * Autor: Adrian Przybilla
   * 
   * Ausloggen des aktuell angemeldeten User
   */
  logout() {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl("/login");
    }).catch(e => {
      this.logging.logging(e);
    });
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Set-Methode für aktuellerUser
   * @param user 
   */
  private setAktuellerUser(user: object): void {
    this.aktuellerUser = user;
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Get-Methode für aktuellerUser
   * @returns aktuellerUser als Object
   */
  getAktuellerUser() {
    return this.aktuellerUser;
  }
}
