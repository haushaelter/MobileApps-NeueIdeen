import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
/**
 * Autor: Anika Haushälter
 */
export class HelperService {

    /**
     * @ignore
     */
    constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) { }

    /**
     * Autor: Anika Haushälter 
     * 
     * Methode zum Schreiben von logs
     * @param nachricht {string} nachricht, welche geschrieben werden soll
     */
    logging(nachricht: string): void {
        console.log(`${(new Date()).toLocaleTimeString()} ${nachricht}`);
    }

    /**
     * Autor: Anika Haushälter 
     * 
     * Methode zum Anzeigen von Toasts. Die Nachricht wird auch geloggt
     * @param nachricht {string} nachricht, die angezeigt werden soll
     */
    async zeigeToast(nachricht: string) {
        try {
            const toast = await this.toastCtrl.create({
                message: nachricht,
                duration: 2000,
            });

            await toast.present();
            this.logging("Toast: " + nachricht);
        } catch (e) {
            //bei einem Fehler wird dieser geloggt
            this.logging(e.message);
        }
    }

    /**
     * Autor: Anika Haushälter 
     * 
     * Methode zum Anzeigen von Dialogen. Die Nachricht wird auch geloggt
     * @param titel {string} titel, der den Titel des Dialoges abbildet
     * @param nachricht {string}  nachricht, die eine Nachricht darstellt
     * @param buttons Buttons, die angezeigt werden soll. Sie müssen den Anzeigenamen und die Funktion dahinter enthalten
     */
    async zeigeDialog(titel: string, nachricht: string, buttons) {
        try {
            const meinAlert = await this.alertCtrl.create({
                header: titel,
                message: nachricht,
                buttons: buttons
            });

            await meinAlert.present();
            this.logging("Dialog: " + nachricht);
        } catch (e) {
            //bei einem Fehler wird dieser geloggt
            this.logging(e.message);
        }
    }
}
