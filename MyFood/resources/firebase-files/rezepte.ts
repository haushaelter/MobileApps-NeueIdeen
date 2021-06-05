import { Rezept } from "../../src/app/models/rezepte/rezept.model";
import { Inhalte } from "../../src/app/models/rezepte/inhalte.model";
import { Schritt } from "../../src/app/models/rezepte/schritt.model";
import { ZutatReferenz } from "../../src/app/models/rezepte/zutat-referenz.model";

let rezept1 = new Rezept().deserialize({
    id: "Fleischkäse mit Spiegelei",
    ersteller: "Olf7J48ZKgWCCjW3wfICFSFkerh1",
    inhalte: new Inhalte().deserialize({
        basis: {
            beschreibung: "Fleischkäse mit Spiegelei und Bratkartoffeln",
            titel: "Fleischkäse mit Spiegelei"
        },
        bewertung: {
            anzahl: "5",
            bewertung: "3"
        },
        1: new Schritt().deserialize({
            beschreibung: "Die Kartoffeln waschen",
            zutaten: [
                "Kartoffeln",
            ]
        }),
    }),
    zutaten: {
        Kartoffeln: new ZutatReferenz().deserialize({
            Menge: 750
        }),
        Salz: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Pfeffer: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Butter: new ZutatReferenz().deserialize({
            Menge: 2
        }),
        Fleischkäse: new ZutatReferenz().deserialize({
            Menge: 4
        }),
        "Ei M": new ZutatReferenz().deserialize({
            Menge: 4
        }),
        Gewuerzgurken: new ZutatReferenz().deserialize({
            Menge: 2
        })
    }
});
let rezept2 = new Rezept();
let rezept3 = new Rezept();
let rezept4 = new Rezept();
let rezept5 = new Rezept();
let rezept6 = new Rezept();
let rezept7 = new Rezept();
let rezept8 = new Rezept();
let rezept9 = new Rezept();
let rezept10 = new Rezept();

export let rezepte: Array<Rezept> = new Array<Rezept>(
    rezept1,
    rezept2,
    rezept3,
    rezept4,
    rezept5,
    rezept6,
    rezept7,
    rezept8,
    rezept9,
    rezept10
)