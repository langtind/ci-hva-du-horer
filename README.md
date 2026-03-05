# CI hva du hører — Modernisert

En moderne, mobilvenlig versjon av Statpeds lyttetreningsprogram **CI hva du hører**, laget for voksne med cochleaimplantat (CI).

## Om prosjektet

Originalprogrammet ble utviklet av [Statped](https://www.statped.no/) (avd. Læringsressurser og teknologiutvikling) i samarbeid med Logopedisk senter i Trondheim, for Hørselshemmedes landsforbund (HLF) med støtte fra Extrastiftelsen. Deler av innholdet bygger på prinsippene bak lyttetreningsmateriellet "Auditrain" av Geoff Plant.

**Originalversjon:** [nettressurser.statped.no/ci-hva-du-horer/webapp](https://nettressurser.statped.no/ci-hva-du-horer/webapp/#forsiden)

Denne versjonen er et **redesign av brukergrensesnittet** — alt innhold og alle lydfiler er fra originalen. Målet er å gjøre programmet mer tilgjengelig på mobil og mer moderne i utseende.

## Hva er endret

- Mobilvenlig, responsivt design (mobile-first)
- Lys og mørk modus for bedre tilgjengelighet
- Moderne UI med store touch-targets
- Quiz-modus for miljølyder (velg blant alternativer i stedet for å lete i lang liste)
- Enklere navigasjon med bottom-nav på mobil

## Moduler

| Modul | Beskrivelse |
|-------|-------------|
| **Tall** | Grunntall 0–99 |
| **Ord** | Enkeltord gruppert etter forbokstav (M, K, T, S, L, Mix) |
| **Setning** | Ord i setningskontekst |
| **Ordpar** | Minimale par — skille mellom lignende ord |
| **Oppbygging** | Setningsoppbygging |
| **Miljølyder** | Gjenkjenn hverdagslyder (dyr, mennesker, husholdning, trafikk) |

Hver modul har to moduser:
- **Lytte** — trykk på et element for å høre det
- **Øve** — hør en lyd, velg riktig svar, få tilbakemelding

## Teknologi

- Vanilla HTML/CSS/JS — ingen rammeverk, ingen byggsteg
- [Howler.js](https://howlerjs.com/) for lydavspilling
- [Fraunces](https://fonts.google.com/specimen/Fraunces) + [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

## Kjør lokalt

```bash
python3 -m http.server 8080
# Åpne http://localhost:8080
```

## Kreditt

- **Originalt innhold og lydfiler:** Statped & Logopedisk senter i Trondheim
- **Idé til modernisering:** [@solvind](https://github.com/solvind)
- **Redesign:** [@langtind](https://github.com/langtind)
