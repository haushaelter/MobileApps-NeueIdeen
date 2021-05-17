import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Logging } from "./helper";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private logging: Logging
  ) { }

  /**
   * Registrierung, ohne Prüfung, ob alle Felder korrekt ausgefüllt wurden
   * @param email 
   * @param passwort 
   */
  registrieren(email, passwort) {
    this.auth.createUserWithEmailAndPassword(email, passwort).then((res) => {
      this.logging.logging("Registrierung durchgeführt.");
      this.router.navigateByUrl("/login");
    }).catch(e => {
      switch (e.code) {
        case "auth/email-already-in-use":
          this.logging.zeigeToast("E-Mail bereits vergeben.");
          this.logging.logging("E-Mail bereits vergeben. Eingabe: " + email);
          break;
        case "auth/invalid-email":
          this.logging.zeigeToast("Invalide E-Mail");
          this.logging.logging("Invalide E-Mail. Eingabe: " + email);
          break;
        case "auth/operation-not-allowed":
          this.logging.zeigeToast("Operation nicht erlaubt.");
          this.logging.logging("Operation nicht erlaubt. Eingabe: " + email);
          break;
        case "auth/weak-password":
          this.logging.zeigeToast("Passwort zu schwach. Mindestens 6 Zeichen benötigt.");
          this.logging.logging("Passwort zu schwach. Eingabe: " + email);
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
  async login(email, passwort) {
    this.auth.signInWithEmailAndPassword(email, passwort).then((res) => {
      this.logging.logging("Nutzer eingeloggt.");
      this.router.navigateByUrl("/home");
    }).catch(e => {
      switch (e.code) {
        case "auth/invalid-email":
          this.logging.zeigeToast("Invalide E-Mail.");
          this.logging.logging("Invalide E-Mail. Eingabe: " + email);
          break;
        case "auth/user-disabled":
          this.logging.zeigeToast("Nutzer deaktiviert");
          this.logging.logging("Nutzer deaktiviert. Nutzer E-Mail: " + email);
          break;
        case "auth/too-many-requests":
          this.logging.zeigeToast("Zu viele Anfragen, bitte versuchen Sie es später erneut.");
          this.logging.logging("Zu oft falsches Passwort für " + email + " eingegeben");
          break;
        case "auth/wrong-password":
          this.logging.zeigeToast("Falsches Passwort.");
          this.logging.logging("Falsches Passwort für " + email + " eingegeben");
          break;
        case "auth/user-not-found":
          this.logging.zeigeToast("User wurde nicht gefunden");
          this.logging.logging("User " + email + " existert nicht. Möglicherweise wurde er gelöscht");
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
}
