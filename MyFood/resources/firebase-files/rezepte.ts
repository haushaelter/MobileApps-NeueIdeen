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
            anzahl: 5,
            bewertung: 3
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
        Gewürzgurken: new ZutatReferenz().deserialize({
            Menge: 2
        })
    }
});
let rezept2  = new Rezept().deserialize({
    id: "Chicken Wings mit Käsedip",
    ersteller: "rcGbXdItVsR8xSeMfdGWB6oaI3E2",
    inhalte: new Inhalte().deserialize({
        basis: {
            beschreibung: "Gegrillte Wings mit einem selbst gemachten Dip",
            titel: "Chicken Wings mit Käsedip"
        },
        bewertung: {
            anzahl: 35,
            bewertung: 3.5
        },
        1: new Schritt().deserialize({
            beschreibung: "Die Hähnchenflügel waschen, trocken tupfen und am Gelenk durchschneiden. Für die Marinade die Butter schmelzen und mit Paprikapulver, Tabasco und Zitronensaft mischen.",
            zutaten: [
                "Hähnchenflügel",
                "Butter",
                "Paprikapulver",
                "Tabasco",
                "Zitronensaft"
            ]
        }),
        2: new Schritt().deserialize({
            beschreibung: "Alles in einer Schüssel mit den Hähnchenflügeln mischen und mindestens eine Stunde ziehen lassen. Dann die Chicken Wings auf den Gril legen und untre gelegentlichem Wenden schön knusprig grillen; das dauert ungefähr 20 Minuten.",
            zutaten: [
                "Hähnchenflügel",
                "Marinade"
            ]
        }),
        3: new Schritt().deserialize({
            beschreibung: "Für den Dip den Knoblauch schälen und fein hacken. Den Käse mit einer Gabel zerdrücken und mit den restlichen  Zutaten verrühren. Mit Pfeffer und 1 Prise Zucker abschmecken. Hähnchenflügel mit Dip servieren.",
            zutaten: [
                "Knoblauch",
                "Blauschimmelkäse",
                "Créme Fraiche",
                "Mayonnaise",
                "Naturjoghurt",
                "Zitronensaft",
                "Pfeffer",
                "Zucker"
            ]
        }),
    }),
    zutaten: {
        Hähnchenflügel: new ZutatReferenz().deserialize({
            Menge: 1000
        }),
        Salz: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Pfeffer: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Butter: new ZutatReferenz().deserialize({
            Menge: 3
        }),
        Tabasco: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Zitronensaft: new ZutatReferenz().deserialize({
            Menge: 2
        }),
        Blauschimmelkäse: new ZutatReferenz().deserialize({
            Menge: 100
        }),
        "Créme Fraiche": new ZutatReferenz().deserialize({
            Menge: 50
        }),
        Mayonnaise: new ZutatReferenz().deserialize({
            Menge: 50
        }),
        Naturjoghurt: new ZutatReferenz().deserialize({
            Menge: 150
        })
    }
});
let rezept3 = new Rezept().deserialize({
    id: "Hamburger",
    ersteller: "A2kmzPY8PWRT3doEiGPJAEC3RAb2",
    inhalte: new Inhalte().deserialize({
        basis: {
            beschreibung: "Klassische Burger",
            titel: "Hamburger"
        },
        bewertung: {
            anzahl: 73,
            bewertung: 4.5
        },
        1: new Schritt().deserialize({
            beschreibung: "Das Rinderhack mit Haferflocken, 2 EL Ketchup, Milch, Senf und Ei zu einem Teig bermengen und gut durchkneten. Mit Salz, Pfeffer und Oregano kräftig würzen.",
            zutaten: [
                "Rinderhack",
                "Haferflocken",
                "Ketchup",
                "Milch",
                "Senf",
                "Ei",
                "Salz",
                "Pfeffer",
                "Oregano"
            ]
        }),
        2: new Schritt().deserialize({
            beschreibung: "Aus dem Teig 4 gleich große Fleischfladen formen. Das Öl in einer Pfanne erhitzen und die Fladen darin von beiden Seiten gut anbraten, dann bei geringer Temperatur etwa 7 Minuten garen.",
            zutaten: [
                "Öl"
            ]
        }),
        3: new Schritt().deserialize({
            beschreibung: "Die Zwiebeln schälen und in Ringe schneiden. Kurz vor Ende der Garzeit auf die Burger legen und kurz mitgaren. Die Brötchen halbieren und mit Butter bestreichen, dann unter dem Grill rösten.",
            zutaten: [
                "Zwiebeln",
                "Burgerbrötchen",
                "Butter"
            ]
        }),
        4: new Schritt().deserialize({
            beschreibung: "In je 1 Brötchen 1 Fleischburger hineinlegen, mit Zwiebelringen belegen und mit Ketchup servieren. Nach Belieben mit Tomatenscheiben und Salatblättern dekorieren.",
            zutaten: []
        }),
    }),
    zutaten: {
        Rinderhack: new ZutatReferenz().deserialize({
            Menge: 600
        }),
        Salz: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Pfeffer: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Haferflocken: new ZutatReferenz().deserialize({
            Menge: 50
        }),
        Ketchup: new ZutatReferenz().deserialize({
            Menge: 2
        }),
        Milch: new ZutatReferenz().deserialize({
            Menge: 20
        }),
        Senf: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        "Ei M": new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Oregano: new ZutatReferenz().deserialize({
            Menge: 0.5
        }),
        Öl: new ZutatReferenz().deserialize({
            Menge: 2
        }),
        Zwiebel: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Burgerbrötchen: new ZutatReferenz().deserialize({
            Menge: 4
        }),
        Butter: new ZutatReferenz().deserialize({
            Menge: 20
        }),

    }
});
let rezept4 = new Rezept().deserialize({
    id: "Paprika-Tomaten-Gemüse",
    ersteller: "Olf7J48ZKgWCCjW3wfICFSFkerh1",
    inhalte: new Inhalte().deserialize({
        basis: {
            beschreibung: "Auch bekannt als Letscho. Schmeckt hervorragend zu Steak oder ähnlichem.",
            titel: "Paprika-Tomaten-Gemüse"
        },
        bewertung: {
            anzahl: 9,
            bewertung: 4
        },
        1: new Schritt().deserialize({
            beschreibung: "In einem Schmortopf das Öl erhitzen, die Paprikaschoten (in Streifen) und Zwiebeln (in Ringe geschnitten) darin ohne Farbe 15 Minuten dünsten",
            zutaten: [
                "Paprikaschoten",
                "Zwiebeln",
                "Öl"
            ]
        }),
        2: new Schritt().deserialize({
            beschreibung: "Die Tomaten zugeben, würzen, in weiteren 15 Minuten weich dünsten.",
            zutaten: [
                "Tomaten (enthäutet)",
                "Salz",
                "Pfeffer",
                "Edelsüßpaprika",
                "Zucker"
            ]
        }),
    }),
    zutaten: {
        Paprikaschoten: new ZutatReferenz().deserialize({
            Menge: 500
        }),
        Salz: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Pfeffer: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Öl: new ZutatReferenz().deserialize({
            Menge: 6
        }),
        Zwiebeln: new ZutatReferenz().deserialize({
            Menge: 3
        }),
        "Tomaten (enthäutet)": new ZutatReferenz().deserialize({
            Menge: 500
        }),
        Edelsüßpaprika: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Zucker: new ZutatReferenz().deserialize({
            Menge: 1
        })
    }
});
let rezept5 = new Rezept().deserialize({
    id: "Kartoffelpuffer",
    ersteller: "pU6N8NOXtUh0xN6seZLVA1GYAbo1",
    inhalte: new Inhalte().deserialize({
        basis: {
            beschreibung: "Auch bekannt als Reiberdatschi oder Reibekuchen.",
            titel: "Kartoffelpuffer"
        },
        bewertung: {
            anzahl: 3,
            bewertung: 4
        },
        1: new Schritt().deserialize({
            beschreibung: "Die Kartoffeln schälen. Auf einer feinen Reibe in eine Schüssel reiben. Mit den Eiern, dem Mehl und Salz vermischen.",
            zutaten: [
                "Kartoffeln",
                "Eier", 
                "Mehl",
                "Salz"
            ]
        }),
        2:  new Schritt().deserialize({
            beschreibung: "In einer beschichteten Pfanne 3 EL Öl erhitzen. Mit einem Esslöffel kleine Puffer in das Fett setzen, mit dem Löffelrücken flach streifen. Bei guter Hitze auf beiden Seiten braun und knusprig backen. Warm stellen, bis alle Kartoffelpuffer gebacken sind",
            zutaten: [
                "Öl",
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
        Mehl: new ZutatReferenz().deserialize({
            Menge: 70
        }),
        Öl: new ZutatReferenz().deserialize({}),
        "Ei M": new ZutatReferenz().deserialize({
            Menge: 2
        }),
    }
});
let rezept6= new Rezept().deserialize({
    id: "Hähnchentopf mit Kartoffeln",
    ersteller: "vdDZ82xogDbQfDaqoVkVGoGy8Ju2",
    inhalte: new Inhalte().deserialize({
        basis: {
            beschreibung: "Ein Eintopf mit Hähnchen und Kartoffeln",
            titel: "Hähnchentopf mit Kartoffeln"
        },
        bewertung: {
            anzahl: 5,
            bewertung: 3
        },
        1: new Schritt().deserialize({
            beschreibung: "Die Fleischteile kalt abspülen, trocken tupfen, mit Salz und Pfeffer einreiben",
            zutaten: [
                "Hähnchenteile",
                "Salz",
                "Pfeffer"
            ]
        }),
        2: new Schritt().deserialize({
            beschreibung: "In einem Schmortopf das Öl erhitzen, die Fleischteile darin aus beiden Seiten scharf anbraten, herausnehmen. Im gleichen Öl die Zwiebeln und die Kartoffelscheiben anbraten. Die Tomatenviertel zugeben und andünsten. Die Hähnchenteile wieder einlegen, die Brühe und den Wein zugießen. Zugedeckt bei mäßiger Hitze in etwa 45 Minuten weich schmoren",
            zutaten: [
                "Olivenöl",
                "Zwiebeln",
                "Kartoffeln",
                "Tomaten (enthäutet)",
                "Hühnerbrühe",
                "Weißwein"
            ]
        }),
    }),
    zutaten: {
        Kartoffeln: new ZutatReferenz().deserialize({
            Menge: 600
        }),
        Salz: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Pfeffer: new ZutatReferenz().deserialize({
            Menge: 1
        }),
        Olivenöl: new ZutatReferenz().deserialize({
            Menge: 4
        }),
        Hähnchenteile: new ZutatReferenz().deserialize({
            Menge: 1000
        }),
        "Tomaten (enthäutet)": new ZutatReferenz().deserialize({
            Menge: 100
        }),
        Hühnerbrühe: new ZutatReferenz().deserialize({
            Menge: 100
        }),
        Weißwein: new ZutatReferenz().deserialize({
            Menge: 100
        }),
        Zwiebeln: new ZutatReferenz().deserialize({
            Menge: 8
        })
    }
});

export let rezepte: Array<Rezept> = new Array<Rezept>(
    rezept1,
    rezept2,
    rezept3,
    rezept4,
    rezept5,
    rezept6,
)