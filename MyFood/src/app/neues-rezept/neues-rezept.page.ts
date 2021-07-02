import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSelect, NavController } from '@ionic/angular';
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

  //Variable für Rezept, das ggfs für Überarbeitungen übergeben wurde
  private data: Rezept;

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

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.rezept;
      }
    });

    if(this.data != undefined){
      this.befuelleForm();
    }
  }

  ngAfterViewInit(){
    for(let schritt in this.inhaltForm?.value.schritte){
      this.zutatSelectOptions(Number(schritt));
    }
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
   * @param id {string} Id der Zutat. Standardmäßig leer
   * @param menge {menge} Menge der Zutat. Standardmäßig null
   * @returns {FormGroup} Neue Zutat
   */
  /**
   * 
   * @returns 
   */
  erstelleZutat(id: string = "", menge: number = null): FormGroup{
    return this.formBuilder.group({
      id: id,
      menge: menge
    });
  }

  /**
   * Erstellt eine neue FormGroup für den Inhalt
   * @param titel {string} Titel des Rezeptes. Standardmäßig leer
   * @param beschreibung {string} Beschreibung des Rezeptes. Standardmäßig leer
   * @param bewertungsAnzahl {number} Anzahl der Bewertungen. Standardmäßig null
   * @param bewertung {number} Durchschnittliche Bewertung. Standardmäßig null
   * @returns {FormGroup}  Neuer Inhalt
   */
  erstelleInhalt(
    titel: string = "", 
    beschreibung: string = "", 
    bewertungsAnzahl:number = 0, 
    bewertung: number = 0): FormGroup{
    this.basisForm = this.formBuilder.group({
      titel: titel,
      beschreibung: beschreibung
    });
    return this.formBuilder.group({
      basis: this.basisForm,
      bewertung: {
        anzahl: bewertungsAnzahl,
        bewertung: bewertung
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
   * @param beschreibung {string} Beschreibung des Schrittes
   * @param zutaten {string} Zutaten, die für den Schritt notwendig sind. Format: Zutat1, Zutat2, ...
   * @returns {FormGroup} Neuer Schritt
   */
  erstelleSchritt(beschreibung: string = "", zutaten: string = ""): FormGroup{
    return this.formBuilder.group({
      beschreibung: beschreibung,
      zutaten: zutaten
    });
  }

  /**
   * Überprüft, ob das letzte Feld der Zutaten leer ist. Andernfalls wird eine neue FormGroup erstellt
   * Die Methode zum Erstellen der FormGroup ist erstelleZutat()
   */
  zutatHinzufuegen(id: string = "", menge: number = null): void{
    if((this.rezeptForm.get('zutaten') as FormArray).value[0]?.id !=""){
      (this.rezeptForm.get('zutaten') as FormArray).push(this.erstelleZutat(id, menge));
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
  schrittHinzufuegen(beschreibung: string = "", zutaten: string = ""){
    if((this.inhaltForm.get('schritte') as FormArray)?.value[0]?.beschreibung != ""){
      (this.inhaltForm.get('schritte') as FormArray).push(this.erstelleSchritt(beschreibung, zutaten));
    } else {
      this.logging.zeigeToast("Du hast bereits ein leeres Feld");
    }
  }

  /**
   * Enfernt einen gewünschten Schritt aus dem FormArray
   * @param index {number} Index des zu löschenden Schrittes im FormArray
   * @param allowed {boolean} Standardwert false. Für den Fall, dass der erste Schritt gelöscht werden muss, kann der Wert true übergeben werden
   */
  entferneSchritt(index, allowed: boolean = false){
    if(allowed || (this.inhaltForm.get('schritte') as FormArray).length !=1){
      (this.inhaltForm.get('schritte') as FormArray).removeAt(index)
    } else {
      this.logging.zeigeToast("Bitte gib mindestens einen Schritt an");
    }
  }


  /**
   * Befüllt die Forms. Wenn kein Rezept übergeben wurde, bleibt alles leer
   */
  befuelleForm(){
    this.inhaltForm = this.erstelleInhalt(
      this.data.inhalte.basis.titel, 
      this.data.inhalte.basis.beschreibung, 
      this.data.inhalte.bewertung.anzahl,
      this.data.inhalte.bewertung.bewertung
    );

    this.rezeptForm = this.formBuilder.group({
      id: this.data.id,
      ersteller: this.data.ersteller,
      inhalte: this.inhaltForm,
      zutaten: this.formBuilder.array([this.erstelleZutat()])
    });

    // Zutaten in die Form fügen. Die bereits vorhandene, leere Zutat wird gelöscht
    this.entferneZutat(0);
    for(let zutat in this.data.zutaten){
      this.zutatHinzufuegen(zutat, this.data.zutaten[zutat]['Menge']);
    }

    // Schritte in die Form fügen. Der bereits vorhandene, leere Schritt wird gelöscht
    this.entferneSchritt(0, true)
    for(let schritt in this.data.inhalte){
      if(schritt != "basis" && schritt != "bewertung"){
        this.schrittHinzufuegen(this.data.inhalte[schritt]["beschreibung"], this.data.inhalte[schritt]["zutaten"].toString());
      }
      
    }
  }

  /**
   * Setzt die ion-select-options auf selected. Es werden alle gesetzt, die als Zutat im entsprechenden Schritt angegeben sind
   * @param schritt {number} index des Schrittes
   */
  zutatSelectOptions(schritt: number){
    // abspeichern der Zutaten des Schrittes
    let zutaten = this.inhaltForm?.value?.schritte[schritt]?.zutaten;

    // Speichern des HTML-Elements ion-select
    let select = (document?.getElementById(`select${schritt}`)) as HTMLIonSelectElement;

    // wenn sowohl Zutaten als auch das HTML-Element gefunden wurden, wird der Wert als Array zugewiesen
    if(select?.value != undefined && zutaten != ""){
      select.value = zutaten.split(",");
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
