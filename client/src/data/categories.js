const A = [
  { value: 87, label: "Moto" },
  { value: 4, label: "Dviračiai, paspirtukai" },
  { value: 76, label: "Spec. transportas" },
  { value: 79, label: "Žemės ūkio technika" },
  { value: 80, label: "Dalys, aksesuarai" },
  { value: 82, label: "Kita" },
];

const B = [
  { value: 3, label: "Baldai, interjeras" },
  { value: 29, label: "Flora, fauna" },
  { value: 35, label: "Grožis, sveikata" },
  { value: 36, label: "Kolekcionavimas" },
  { value: 37, label: "Maistas, gėrimai" },
  { value: 56, label: "Namų apyvokos reikmenys" },
  { value: 63, label: "Antikvariatas" },
  { value: 70, label: "Kietas, skystas kuras" },
  { value: 71, label: "Kita" },
];

const C = [
  { value: 8, label: "Medžiagos, įranga" },
  { value: 38, label: "Kita" },
];

const D = [
  { value: 108, label: "Kompiuteriai" },
  { value: 109, label: "Išoriniai įrenginiai" },
  { value: 110, label: "Kompiuterių komponentai" },
  { value: 111, label: "Priedai, aksesuarai" },
  { value: 112, label: "Programinė įranga, žaidimai" },
  { value: 113, label: "Tinklo įranga" },
  { value: 114, label: "Kita" },
];

const E = [
  { value: 1, label: "Mobilieji telefonai" },
  { value: 2, label: "Radijo, GPS įranga" },
  { value: 18, label: "Telefonai, faksai" },
  { value: 19, label: "Dalys, priedai" },
  { value: 39, label: "Kita" },
];

const F = [
  { value: 11, label: "Audio" },
  { value: 12, label: "Video" },
  { value: 13, label: "Buitinė technika" },
  { value: 15, label: "Foto, optika" },
  { value: 16, label: "Biuro, prekybinė technika" },
  { value: 21, label: "Sodui, daržui, miškui" },
  { value: 23, label: "Pramoninė technika" },
  { value: 24, label: "Kita" },
];

const G = [
  { value: 10, label: "Knygos, kinas" },
  { value: 25, label: "Sportas, žaidimai" },
  { value: 26, label: "Turizmas" },
  { value: 27, label: "Medžioklė, žvejyba" },
  { value: 28, label: "Muzika, instrumentai" },
  { value: 47, label: "Pakvietimai, bilietai" },
  { value: 48, label: "Kita" },
];

const H = [
  { value: 49, label: "Moterims" },
  { value: 50, label: "Vyrams" },
  { value: 52, label: "Avalynė" },
  { value: 54, label: "Spec. apranga" },
  { value: 55, label: "Papuošalai, aksesuarai" },
  { value: 57, label: "Kita" },
];

const I = [
  { value: 59, label: "Drabužiai, avalynė" },
  { value: 61, label: "Baldai" },
  { value: 75, label: "Priežiūros priemonės" },
  { value: 100, label: "Vežimėliai, autokėdutės" },
  { value: 125, label: "Judėjimo priemonės" },
  { value: 126, label: "Žaislai, mokyklinės prekės" },
  { value: 127, label: "Kita" },
];

const J = [
  { value: 5, label: "Kita" },
];

// Available numbers:
// 7, 20, 42, 44, 68, 69, 73, 92, 93, 94, 95, 96, 97, 98, 101, 107, 117, 118, 119, 120, 122, 124,
// 81, 83, 103, 104, 105, 106, 88, 90, 91, 116, 115, 40, 41, 58, 60, 65, 85, 86, 99, 121
// >=128

const categories = [
  {
    label: "Transportas",
    options: A,
  },
  {
    label: "Buitis",
    options: B,
  },
  {
    label: "Nekilnojamasis turtas",
    options: C,
  },
  {
    label: "Kompiuterija",
    options: D,
  },
  {
    label: "Komunikacijos",
    options: E,
  },
  {
    label: "Technika",
    options: F,
  },
  {
    label: "Pramogos",
    options: G,
  },
  {
    label: "Drabužiai, avalynė",
    options: H,
  },
  {
    label: "Auginantiems vaikus",
    options: I,
  },
  {
    label: "Kita",
    options: J,
  },
];

export default categories;
