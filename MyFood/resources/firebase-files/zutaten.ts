import { Zutat } from "../../src/app/models/zutaten/zutat.model";

let zutat1 = new Zutat().deserialize({
    id: "Salz",
    standardeinheit: "Prise",
    kalorien: 1,
    eiweiß: 0,
    fett: 0,
    kohlenhydrate: 0,
});
let zutat2 = new Zutat().deserialize({
    id: "Zwiebeln",
    standardeinheit: "Stück"
});
let zutat3 = new Zutat().deserialize({
    id: "Weißwein",
    standardeinheit: "ml"
});
let zutat4 = new Zutat().deserialize({
    id: "Hühnerbrühe",
    standardeinheit: "ml"
});
let zutat5 = new Zutat().deserialize({
    id: "Tomaten (enthäutet)",
    standardeinheit: "g"
});
let zutat6 = new Zutat().deserialize({
    id: "Hähnchenteile",
    standardeinheit: "g"
});
let zutat7 = new Zutat().deserialize({
    id: "Ölivenöl",
    standardeinheit: "EL"
});
let zutat8 = new Zutat().deserialize({
    id: "Pfeffer",
    standardeinheit: "Prise"
});
let zutat9 = new Zutat().deserialize({
    id: "Kartoffeln",
    standardeinheit: "g"
});
let zutat10 = new Zutat().deserialize({
    id: "Mehl",
    standardeinheit: "g"
});

let zutat11 = new Zutat().deserialize({
    id: "Öl",
    standardeinheit: "EL"
});

let zutat12 = new Zutat().deserialize({
    id: "Ei M",
    standardeinheit: "Stück"
});

let zutat13 = new Zutat().deserialize({
    id: "Paprikaschoten",
    standardeinheit: "g"
});

let zutat14 = new Zutat().deserialize({
    id: "Edelsüßpaprika",
    standardeinheit: "Prise"
});

let zutat15 = new Zutat().deserialize({
    id: "Zucker",
    standardeinheit: "Prise"
});

let zutat16 = new Zutat().deserialize({
    id: "Butter",
    standardeinheit: "g"
});

let zutat17 = new Zutat().deserialize({
    id: "Burgerbrötchen",
    standardeinheit: "Stück"
});

let zutat18 = new Zutat().deserialize({
    id: "Oregano",
    standardeinheit: "TL"
});

let zutat19 = new Zutat().deserialize({
    id: "Senf",
    standardeinheit: "EL"
});

let zutat20 = new Zutat().deserialize({
    id: "Milch",
    standardeinheit: "ml"
});

let zutat21 = new Zutat().deserialize({
    id: "Ketchup",
    standardeinheit: "EL"
});

let zutat22 = new Zutat().deserialize({
    id: "Haferflocken",
    standardeinheit: "g"
});

let zutat23 = new Zutat().deserialize({
    id: "Rinderhack",
    standardeinheit: "g"
});

let zutat24 = new Zutat().deserialize({
    id: "Naturjoghurt",
    standardeinheit: "g"
});

let zutat25 = new Zutat().deserialize({
    id: "Mayonnaise",
    standardeinheit: "g"
});

let zutat26= new Zutat().deserialize({
    id: "Créne Fraiche",
    standardeinheit: "g"
});

let zutat27 = new Zutat().deserialize({
    id: "Blauschimmelkäse",
    standardeinheit: "g"
});

let zutat28 = new Zutat().deserialize({
    id: "Zitronensaft",
    standardeinheit: "EL"
});

let zutat29 = new Zutat().deserialize({
    id: "Tabasco",
    standardeinheit: "EL"
});

let zutat30 = new Zutat().deserialize({
    id: "Hähnchenflügel",
    standardeinheit: "g"
});

let zutat31 = new Zutat().deserialize({
    id: "Fleischkäse",
    standardeinheit: "g"
});

let zutat32 = new Zutat().deserialize({
    id: "Gewürzgurken",
    standardeinheit: "Stück"
});

export let zutaten: Array<Zutat> = new Array<Zutat>(
    zutat1,
    zutat2,
    zutat3,
    zutat4,
    zutat5,
    zutat6,
    zutat7,
    zutat8,
    zutat9,
    zutat10,
    zutat11,
    zutat12,
    zutat13,
    zutat14,
    zutat15,
    zutat16,
    zutat17,
    zutat18,
    zutat19,
    zutat20,
    zutat21,
    zutat22,
    zutat23,
    zutat24,
    zutat25,
    zutat26,
    zutat27,
    zutat28,
    zutat29,
    zutat30,
    zutat31,
    zutat32
)