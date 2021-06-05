import { Zutat } from "../../src/app/models/zutaten/zutat.model";

let zutat1 = new Zutat().deserialize({
    id: "Salz",
    standardeinheit: "g",
    kalorien: 1,
    eiweiß: 0,
    fett: 0,
    kohlenhydrate: 0,
});
let zutat2
let zutat3
let zutat4
let zutat5
let zutat6
let zutat7
let zutat8
let zutat9
let zutat10

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
)