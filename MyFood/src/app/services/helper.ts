import { AlertController, ToastController } from "@ionic/angular";

export class Logging{

    constructor(private alertCtrl: AlertController, private toastCtrl: ToastController){}
    /**
     * Methode zum Schreiben von logs
     * @param nachricht 
     */
    logging(nachricht: string){
         
        console.log(`${(new Date()).toLocaleTimeString()} ${nachricht}`);
    }

    /**
     * Toast ausgeben
     * @param nachricht 
     */
    async zeigeToast(nachricht:string){
        try{
            const toast = await this.toastCtrl.create({
                message: nachricht,
                duration: 2000
            });
        } catch (e){
            //bei einem Fehler wird dieser geloggt
            this.logging(e.message);
        }
    }

    /**
     * Dialog anzeigen
     * @param titel 
     * @param nachricht 
     */
    async zeigeDialog(titel: string, nachricht: string){
        try{
            const meinAlert = await this.alertCtrl.create({
                header: titel,
                message: nachricht,
                buttons: ["Ok"]
            });

            await meinAlert.present();

        } catch (e){
            //bei einem Fehler wird dieser geloggt
            this.logging(e.message);
        }
    }
}