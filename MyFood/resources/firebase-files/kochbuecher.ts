import { Kochbuch } from "../../src/app/models/kochbuecher/kochbuch";

// Beispieldaten für Datenbank
let kochbuch1 = new Kochbuch().deserialize({
    id: "Nur für echte Kerle",
    bewertung: {
        anzahl: 3,
        bewertung: 3.5
    },
    verlag: "Naumann & Goebel Verlagsgesellschaft GmbH",
    rezepte: [
        "Fleischkäse mit Spiegelei",
        "Chicken Wings mit Käsedip",
        "Hamburger",
    ],
});
let kochbuch2 = new Kochbuch().deserialize({
    id: "Ich Helf Dir Kochen",
    bewertung: {
        anzahl: 3,
        bewertung: 5
    },
    verlag: "blv",
    rezepte: [
        "Paprika-Tomaten-Gemüse",
        "Kartoffelpuffer",
        "Hähnchentopf mit Kartoffeln"
    ],
});;

export let kochbuecher: Array<Kochbuch> = new Array<Kochbuch>(
    kochbuch1,
    kochbuch2
)