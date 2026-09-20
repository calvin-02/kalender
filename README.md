# Kalender

Kalender für Training, Studium und Termine — auf einem Gerät, ohne Konto, ohne Netz.

**Adresse:** <https://calvin-02.github.io/kalender/>

## Wofür das gebaut ist

Ein Trainingsplan zeigt drei Krafttage. Die Läufe stehen nirgends, also finden sie nicht statt.
Der Kalender führt beides in einer Liste und **trennt die Zähler**: `Kraft 3/3` neben `Lauf 0/2`.
Was fehlt, ist dann nicht wegzuschauen.

Sechs Kategorien, jede mit eigener Farbe:

| Kategorie | Farbe | Gedacht für |
|---|---|---|
| Krafttraining | Orange | Die Goliaz-Tage — ohne Uhrzeit, nur dem Tag zugeordnet |
| Laufen | Türkis | Eigene Zeile, eigener Zähler, geht nicht in „Training" unter |
| Bachelorarbeit | Blau | Abgaben, Meilensteine, Betreuungsgespräche |
| Uni | Ocker | Vorlesungen, Übungen, Klausuren |
| Gemeinde | Violett | Gottesdienste, Gruppen, Treffen |
| Privates | Schiefer | Alles andere — Arzt, Verabredungen, Familie |

Die Farben folgen der Okabe-Ito-Palette und bleiben bei Rot-Grün-Sehschwäche weitgehend
unterscheidbar. Bei sechs Kategorien trägt Farbe nie allein: In der Eingabemaske steht der
Name daneben, in den Listen der Titel.

Eigene Wochenzähler haben **Krafttraining und Laufen** — die anderen vier nicht, weil dort
kein Soll existiert, das man verfehlen könnte.

## Einrichten auf dem Handy

1. Adresse **einmal mit Netz** öffnen und vollständig laden lassen.
2. Chrome: **⋮ → Zum Startbildschirm hinzufügen**. Danach eigenes Symbol, Start im Vollbild.
3. Ab dann öffnet und speichert die App **auch ohne Verbindung**.

## Wo die Daten liegen

**In diesem Verzeichnis liegen keine Termine und keine Werte** — nur die leere App.
`.gitignore` sperrt `*.json`, damit das so bleibt.

Die Einträge liegen im `localStorage` des Geräts. Das heißt auch: Sie sind **nur auf diesem
Gerät**. Über *Einstellungen → Alles als Datei sichern* holst du sie heraus, über *Aus Datei
einlesen* zurück. Beim Einlesen wird zusammengeführt statt überschrieben — der jeweils neuere
Stand gewinnt, nichts verschwindet stillschweigend.

> Geplant: Abgleich über Firestore, damit Termine zwischen Geräten wandern und von außen
> befüllt werden können. Bis dahin ist die Sicherungsdatei der Weg.

## Dateien

| Datei | Rolle |
|---|---|
| `index.html` | die vollständige App — eine Datei, kein Bauwerkzeug nötig |
| `sw.js` | Offline-Vorhaltung. **Bei jeder Änderung die Fassungsnummer hochzählen** |
| `manifest.webmanifest` | Name, Symbole, Vollbildstart |
| `icon-*.png`, `apple-touch-icon.png` | Symbole |
| `teile/` | Quellstücke, aus denen `index.html` zusammengesetzt wird |

## Ändern

`index.html` wird aus `teile/` zusammengesetzt — die Reihenfolge steckt in den Nummern:

```bash
cat teile/0*.html > index.html
```

Danach in `sw.js` die Zeile `const FASSUNG = "kalender-x.y.z"` hochzählen **und** in
`teile/04_js_daten.html` `FASSUNG` nachziehen. Ohne diesen Schritt bleibt auf den Geräten die
alte Fassung liegen.

| Baustein | Inhalt |
|---|---|
| `01_kopf.html` | Kopf, Gestaltungssystem, Kopfleiste, Ansichtsschalter |
| `02_ansichten.html` | Tag, Woche, Monat, Aufgaben — die leeren Gerüste |
| `03_boegen.html` | Eintragsmaske, Tageswerte, Einstellungen |
| `04_js_daten.html` | **Datenmodell, Speicher, Datumsrechnung** · hier steht `FASSUNG` |
| `05_js_ui.html` | Ansichten zeichnen, Zähler, Ansichtswechsel |
| `06_js_boegen.html` | Eintrag anlegen und ändern, Werte, Sichern und Einlesen |
| `07_js_start.html` | Verdrahtung, Wischen, Dienstarbeiter, Start |

## Was drin ist

- **Tagesansicht** als Standard: großes Datum, Einträge ohne Uhrzeit zuerst, dann Termine,
  darunter die Tageswerte.
- **Wochenansicht** mit getrennten Zählern für Kraft und Laufen.
- **Monatsansicht** als Raster mit Farbpunkten je Kategorie.
- **Aufgaben**: Dinge ohne festen Tag — und ganz oben die Termine, die du nicht abgehakt hast.
  Die verschwinden nicht in der Vergangenheit, sie stehen rot in der Liste.
- **Tageswerte**: Gewicht, Ruhepuls, Schlaf, Anstrengung, Erholung.
- Wischen blättert Tag, Woche oder Monat. Hell und dunkel nach Gerät oder fest eingestellt.

## Was noch fehlt

- Abgleich über Firestore
- Erinnerungen als Push-Benachrichtigung
- Wiederkehrende Termine
- Ermüdungsampel aus den Tageswerten
