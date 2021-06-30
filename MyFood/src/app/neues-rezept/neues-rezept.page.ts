import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Rezept } from '../models/rezepte/rezept.model';
import { Zutat } from '../models/zutaten/zutat.model';
import { FileStorageService } from '../services/file-storage.service';
import { FirebaseService } from '../services/firebase.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-neues-rezept',
  templateUrl: './neues-rezept.page.html',
  styleUrls: ['./neues-rezept.page.scss'],
})

/**
 * Autor: Anika Haushälter
 */
export class NeuesRezeptPage implements OnInit {
  readonly seitentitel = "Neues Rezept";

  //Variablen für die Forms
  private rezeptForm: FormGroup;
  private inhaltForm: FormGroup;
  private basisForm: FormGroup;

  //Variablen aus der Datenbank und dem local storage
  private userId: string = localStorage.getItem('user');
  private vorhandeneRezepte:Array<string> = this.firebase.getAlleRezeptIds();
  private alleZutaten: Array<Zutat> = this.firebase.getAlleZutaten();

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private formBuilder: FormBuilder,
    private firebase: FirebaseService,
    private filestorage: FileStorageService,
    private navCtrl: NavController,
    private logging: HelperService
  ) { }

  ngOnInit() {
    this.inhaltForm = this.erstelleInhalt();
    this.rezeptForm = this.formBuilder.group({
      id: '',
      ersteller: this.userId,
      inhalte: this.inhaltForm,
      zutaten: this.formBuilder.array([this.erstelleZutat()])
    })
    
  }

  standardeinheitAnzeigen(item):string{
    try{
      return this.alleZutaten.filter(filterZutat => filterZutat.id === item)[0].standardeinheit;
    } catch(e) {
      return "";
    };
  }

  /**
   * Erstellt eine neue Zutat für die FormGroup
   * @returns {FormGroup} Neue Zutat
   */
  erstelleZutat(): FormGroup{
    return this.formBuilder.group({
      id: '',
      menge: null
    });
  }

  /**
   * Erstellt eine neue FormGroup für den Inhalt
   * @returns {FormGroup}  Neuer Inhalt
   */
  erstelleInhalt(): FormGroup{
    this.basisForm = this.formBuilder.group({
      titel: '',
      beschreibung: ''
    });
    return this.formBuilder.group({
      basis: this.basisForm,
      bewertung: {
        anzahl: 0,
        bewertung: 0
      },
      schritte: this.formBuilder.array([this.erstelleSchritt()])
    });
  }

  /**
   * Überprüft die Datenbank, ob die gewünschte ID vorhanden ist. Andernfalls wird um die nächste freie Zahl ergänzt, beginnend bei 1
   */
  setId(){
    if(this.vorhandeneRezepte.includes(this.basisForm.value.titel)){
      let i = 1;
      while(this.vorhandeneRezepte.includes(`${this.basisForm.value.titel}${i}`)){
        i++;
      }
      this.rezeptForm.patchValue({
        id: `${this.basisForm.value.titel}${i}`
      });
    } else {
      this.rezeptForm.patchValue({
        id: `${this.basisForm.value.titel}`
      });
    }
    
  }

  /**
   * Erstellt einen neuen Schritt für die Form
   * @returns {FormGroup} Neuer Schritt
   */
  erstelleSchritt(): FormGroup{
    return this.formBuilder.group({
      beschreibung: '',
      zutaten: ''
    });
  }

  /**
   * Überprüft, ob das letzte Feld der Zutaten leer ist. Andernfalls wird eine neue FormGroup erstellt
   * Die Methode zum Erstellen der FormGroup ist erstelleZutat()
   */
  zutatHinzufuegen(): void{
    if((this.rezeptForm.get('zutaten') as FormArray).value[0]?.id !=""){
      (this.rezeptForm.get('zutaten') as FormArray).push(this.erstelleZutat());
    } else {
      this.logging.zeigeToast("Du hast bereits ein leeres Feld");
    }
    
  }

  /**
   * Enfernt eine gewünschte Zutat aus dem FormArray
   * @param index {number} Index der zu löschenden Zutat im FormArray
   */
  entferneZutat(index: number){
    (this.rezeptForm.get('zutaten') as FormArray).removeAt(index);
  }
  
  /**
   * Überprüft, ob ein leerer Schritt im FormArray vorhanden ist. Andernfalls wird eine neue FormGroup erstellt.
   * Die Methode zum Erstellen der FormGroup ist erstelleSchritt()
   */
  schrittHinzufuegen(){
    if((this.inhaltForm.get('schritte') as FormArray).value[0].beschreibung != ""){
      (this.inhaltForm.get('schritte') as FormArray).push(this.erstelleSchritt());
    } else {
      this.logging.zeigeToast("Du hast bereits ein leeres Feld");
    }
  }

  /**
   * Enfernt einen gewünschten Schritt aus dem FormArray
   * @param index {number} Index des zu löschenden Schrittes im FormArray
   */
  entferneSchritt(index){
    if((this.inhaltForm.get('schritte') as FormArray).length !=1){
      (this.inhaltForm.get('schritte') as FormArray).removeAt(index)
    } else {
      this.logging.zeigeToast("Bitte gib mindestens einen Schritt an");
    }
  }

  /**
   * Methode zum Speichern eines Rezeptes
   * @returns void
   */
  speichern():void{
    let rezeptJson = this.rezeptForm.value;
  
    //Überprüfen auf Vollständigkeit
    if(rezeptJson.inhalte.basis.titel == ''){
      this.logging.zeigeToast("Bitte gib einen Titel für dein Rezept an");
      return;
    }
    if(rezeptJson.zutaten[0]?.id == ''){
      this.logging.zeigeToast("Bitte gib mindestens eine Zutat an");
      return;
    }
    if(rezeptJson.inhalte.schritte[0].beschreibung == ''){
      this.logging.zeigeToast("Bitte gib mindestens einen Schritt an");
      return;
    }

    //Verarbeiten der Schritte
    for(let i = 0; i<rezeptJson.inhalte.schritte.length; i++){
      rezeptJson.inhalte[i+1] = (rezeptJson.inhalte.schritte[i]);      
      rezeptJson.inhalte[i+1].zutaten = rezeptJson.inhalte[i+1].zutaten.split(', ');      
    }
    delete rezeptJson.inhalte["schritte"];
    
    //Verarbeiten der Zutaten
    for(let i = 0; i<rezeptJson.zutaten.length; i++){
      /**
       * Zutaten kommen an als:
       * 0: {
       *  id: "meineId",
       *  menge: 0
       * }
       * und werden verwandelt in 
       * meineId: {
       *  menge: 0
       * }
       */
      rezeptJson.zutaten[rezeptJson.zutaten[i].id] = {
        menge: rezeptJson.zutaten[i].menge
      }
      
      //Überprüfen der Datenbank, ob die Zutaten vorhanden sind und speichern falls nicht
      this.checkZutatVorhanden(rezeptJson.zutaten[i]);

      //Entfernen der Nummer aus der JSON
      delete rezeptJson.zutaten[i];
    }
    
    //Speichern in Datenbank
    let rezept = new Rezept().deserialize(rezeptJson);
    
    this.firebase.setRezept(rezept);

    //forms leeren
    this.rezeptForm.reset();
    this.inhaltForm.reset();
    this.basisForm.reset();

    //navigieren zu neuem Rezept
    this.navCtrl.navigateForward(`/rezept?id=${rezeptJson.id}`);
    
  }

  /**
   * Überprüft, ob die Zutat in der Datenbank vorhanden ist. Falls nicht, wird sie gespeichert
   * @param zutat 
   */
  checkZutatVorhanden(zutat: JSON): void {
    let contains: boolean = false;

    //Überprüfen, ob die Zutat in der Datenbank vorhanden ist
    this.alleZutaten.forEach(item => {
      console.log(zutat["id"]);
      console.log(item.id);
      if(zutat["id"] == item.id){
        contains = true;
      }
    });

    //Falls die Zutat nicht gefunden wurde, wird sie gespeichert
    if(!contains){
      let newZutat = new Zutat();
      newZutat.deserialize({
        id: zutat["id"],
        standardeinheit: "g"
      })
      this.firebase.setZutat(newZutat);
    }
  }
}
