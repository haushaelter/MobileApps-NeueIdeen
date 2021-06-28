import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HelperService } from "./helper.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private aktuellerUser;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private logging: HelperService
  ) {
    this.checkAuthState();
  }

  checkAuthState(){
    this.auth.onAuthStateChanged(user => {
      this.setAktuellerUser(user);
      if(user){
        localStorage.setItem('user', user.uid);
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  /**
   * Prüft, ob ein User eingeloggt ist
   * @returns true bei eingeloggtem User
   */
  isLoggedIn(){
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
   */
  passwortVergessen(email) {
    this.auth.sendPasswordResetEmail(email).then((r) => {
      this.logging.logging("Mail versendet.");
      this.router.navigateByUrl("/login");
    }).catch(e => {
      switch (e.code) {
        case "auth/invalid-email":
          this.logging.zeigeToast("Invalide E-Mail.");
          this.logging.logging("Invalide E-Mail. Eingabe: " + email);
          break;
        case "auth/user-not-found":
          this.logging.zeigeToast("Unbekannte E-Mail.");
          this.logging.logging("Unbekannte E-Mail. Eingabe: " + email);
          break;
        default:
          this.logging.zeigeToast("Unbekannter Fehler.");
          this.logging.logging(e);
      }
      this.logging.logging("Fehler-Code: " + e.code + "; E-Mail: " + email);
    });
  }

  logout () {
    this.auth.signOut().then(() => {
      this.router.navigateByUrl("/login");
    }).catch(e => {
      this.logging.logging(e);
    });
  }

  private setAktuellerUser(user: object): void {
    this.aktuellerUser = user;
  }

  getAktuellerUser(){
    return this.aktuellerUser;
  }
}
