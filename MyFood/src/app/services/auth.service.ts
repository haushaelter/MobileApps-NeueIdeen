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
      this.logging.logging("Fehler bei der Registrierung");
      this.logging.logging(e);
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
        case "auth/wrong-password":
          this.logging.zeigeToast("Falsches Passwort.");
          this.logging.logging("Falsches Passwort für " + email + " eingegeben");
          break;
        case "auth/too-many-requests":
          this.logging.zeigeToast("Zu viele Anfragen, bitte versuchen Sie es später erneut.");
          this.logging.logging("Zu oft falsches Passwort für " + email + " eingegeben");
          break;
        case "auth/invalid-email":
            this.logging.zeigeToast("Invalide E-Mail.");
            this.logging.logging("Invalide E-Mail. Eingabe: " + email);
        default:
          this.logging.zeigeToast("Es ist ein Fehler aufgetreten.");
          this.logging.logging("Anmeldefehler. Fehldercode noch nicht als Case hinzugefügt.");
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
          this.logging.logging(e);
      }
      this.logging.logging("Fehler-Code: " + e.code + "; E-Mail: " + email);
    });
  }
}
