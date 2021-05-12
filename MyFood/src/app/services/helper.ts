import { AlertController, ToastController } from "@ionic/angular";

export class Logging{

    constructor(private alertCtrl: AlertController, private toastCtrl: ToastController){}

    /**
     *  Aufrufen von Logging
     * Erwartet ggfs Titel, Nachricht und Ziffer 1 oder 2. Daran wird entschieden, ob Dialog oder Toast angezeigt wird
     * 1 = Dialog, 2 = Toast, nichts/anders = nur console
     */
    logging(titel: string, nachricht: string){
        //Anfangs alle Möglichkeiten auskommentiert und nur die console logt.

        // if(art==1){
        //     this.zeigeDialog(titel, nachricht);
        // } else if(art==2){
        //     this.zeigeToast(nachricht);
        // } 
        console.log(nachricht)
    }

    async zeigeToast(nachricht:string){
        try{
            const toast = await this.toastCtrl.create({
                message: nachricht,
                duration: 2000
            });
        } catch (e){
            //bei einem Fehler wird dieser in der Console ausgegeben
            this.logging("", e)
        }
    }

    async zeigeDialog(titel: string, nachricht: string){
        try{
            const meinAlert = await this.alertCtrl.create({
                header: titel,
                message: nachricht,
                buttons: ["Ok"]
            });

            await meinAlert.present();

        } catch (e){
            //bei einem Fehler wird dieser in der Console ausgegeben
            this.logging("", e)
        }
    }
}