# Sanity CMS – Admin-Handbuch

Für die Praxis Dr. Ümit Alici. Dieses Handbuch beschreibt, was im Sanity Studio bearbeitet werden kann, wie Entwürfe und Veröffentlichung funktionieren, und was eine Veröffentlichung tatsächlich bewirkt. Alle Beschreibungen basieren auf dem echten, bereits migrierten Projekt-Schema (`sanity/schemaTypes/`) und dem tatsächlichen Inhalt im `production`-Dataset (qhrodl8k) — nichts davon ist erfunden oder angenommen.

## Bevor du loslegst: ein wichtiger technischer Hinweis zum Login

Beim Versuch, dich unter `http://127.0.0.1:3000/studio/` anzumelden, wird der Login aktuell **fehlschlagen** — nicht wegen eines Fehlers im Studio selbst, sondern weil die CORS-Origin-Liste deines Sanity-Projekts bisher nur `http://localhost:3333` erlaubt (vermutlich von einem früheren eigenständigen Studio-Test), nicht aber `http://127.0.0.1:3000`, wo das Studio in diesem Next.js-Projekt tatsächlich eingebettet ist. Das wurde in dieser Sitzung direkt nachgewiesen (Browser-Konsole zeigt `CORS policy: No 'Access-Control-Allow-Origin' header`), nicht nur vermutet.

**Fix (einmalig, 30 Sekunden, keine Datenänderung):**
- Entweder du fügst selbst unter [sanity.io/manage](https://sanity.io/manage) → Projekt „hno-alici-web" (`qhrodl8k`) → **API** → **CORS Origins** → **Add CORS origin** die beiden Einträge `http://127.0.0.1:3000` und `http://localhost:3000` hinzu (jeweils mit „Allow credentials" aktiviert) —
- oder du erteilst mir die Berechtigung, genau das über die bereits authentifizierte Sanity-CLI für dich zu tun (der Versuch wurde von der Automatik-Sicherung meines Werkzeugs blockiert, weil es eine Projekteinstellung ändert — das ist eine reine Zugriffs-Konfiguration, keine Inhaltsänderung, aber ich frage lieber nach, als es zu erzwingen).

Danach funktioniert der Login unter genau der von dir gewünschten URL.

## Login

1. Lokalen Server starten (bereits gestartet): `npm run dev`, erreichbar unter `http://127.0.0.1:3000/`.
2. Im Browser `http://127.0.0.1:3000/studio/` öffnen (nach dem CORS-Fix oben).
3. Mit deinem bestehenden Sanity-Konto anmelden (Google/GitHub/E-Mail — je nachdem, womit das Konto ursprünglich erstellt wurde).
4. Links siehst du die Navigation „Inhalte" mit allen unten beschriebenen Bereichen.

## Grundprinzip: Entwurf → Veröffentlichung

Jedes Dokument hat zwei Zustände:
- **Entwurf (Draft)**: Solange du tippst, speichert Sanity automatisch einen Entwurf — nichts geht verloren, aber **auf der echten Website ändert sich noch nichts**. Ein Entwurf ist nur im Studio sichtbar.
- **Veröffentlicht (Published)**: Erst der Klick auf den grünen **„Publish"**-Button macht die Änderung zur offiziellen Version. Das haben wir in dieser Sitzung mit einem echten, isolierten Test-Dokument nachweislich geprüft (Entwurf blieb unsichtbar, erst nach Veröffentlichung erschien er im Build).

**Wichtig, technische Besonderheit dieser Website:** Die Website ist ein statischer Export (kein Live-Server). Eine Veröffentlichung in Sanity erscheint also **nicht sofort** auf `hno-alici.at` — dafür muss die Website neu gebaut werden (entweder automatisch über den geplanten, noch nicht aktivierten Webhook, oder manuell). Bis dahin zeigt die Live-Website weiter den Stand des letzten Builds.

## Die 9 Bereiche im Detail

### 1. Ärzte (`doctor`)
**Aktuell real im System:** 1 Eintrag (Dr. Ümit Alici).
**Bearbeitbar:** Name, Haupt-/Vertretungsarzt-Kennzeichen, Portraitfoto, Kurzbeschreibung, Lebenslauf (Liste, DE/TR getrennt), Qualifikationen (Liste), Philosophie-Text, Kernaussagen.
**Speichern:** automatisch als Entwurf beim Tippen.
**Veröffentlichen:** „Publish"-Button oben rechts im Dokument.
**Auswirkung:** Nach dem nächsten Website-Build ändert sich der Inhalt der Arztprofil-Seite (`/dr-uemit-alici`) und ggf. das Hero-Portrait auf der Startseite.

### 2. Mitarbeiter (`staffMember`)
**Aktuell real im System:** 9 Einträge (alle echten Namen, in der bestehenden Reihenfolge, bereits erfolgreich vollständig migriert — in dieser Sitzung direkt verglichen: Sanity-Daten und lokale Daten zeigen exakt dieselben 9 Namen in derselben Reihenfolge).
**Bearbeitbar:** Name, Funktion (DE/TR), Foto, Reihenfolge (Zahl — bestimmt die Anzeige-Reihenfolge auf der Team-Seite), „Aktiv"-Schalter (zum vorübergehenden Ausblenden, ohne den Eintrag zu löschen).
**Neuen Mitarbeiter hinzufügen:** In der Liste „Mitarbeiter" oben auf „+ Erstellen" klicken, Felder ausfüllen, „Publish".
**Foto austauschen:** Dokument öffnen → Foto-Feld anklicken → neues Bild hochladen (Drag & Drop oder Dateiauswahl) → der Bildausschnitt lässt sich per „Hotspot" direkt im Editor festlegen → „Publish".
**Auswirkung:** Team-Seite (`/team`) zeigt die aktualisierte Liste nach dem nächsten Build.

### 3. Profilfotos
Es gibt zwei Wege, ein Foto zu ändern:
- Direkt am jeweiligen Dokument (Arzt-Portrait am `doctor`-Dokument, Mitarbeiterfoto am jeweiligen `staffMember`-Dokument).
- Zusätzlich gibt es unter **Website-Einstellungen → Editierbare Bilder** fünf zentrale Bildpositionen (Startseite-Hintergrund, Porträt Dr. Alici, Porträt Dr. Meier, Team-Foto, Leistungen-Übersichtsbild) — das ersetzt das alte Admin-Panel-Bildsystem.
**Wichtig:** Bilder werden beim Hochladen automatisch für Web/Mobile optimiert (Sanity übernimmt das, keine manuelle Bildbearbeitung nötig).

### 4. Öffnungszeiten (`openingHours`, Singular-Dokument)
**Aktuell real im System:** 1 Eintrag, exakt deckungsgleich mit den auf der Website gezeigten Zeiten (Montag/Mittwoch mit Mittagspause, Dienstag/Donnerstag/Freitag durchgehend) — in dieser Sitzung direkt geprüft.
**Bearbeitbar:** Für jeden der 7 Wochentage eine Liste von Zeitfenstern (leer = geschlossen). Mehrere Zeitfenster pro Tag möglich (für die Mittagspause an Montag/Mittwoch). Zusätzlich „Sonderöffnungszeiten" für einzelne, abweichende Kalendertage.
**Besonderheit:** Dies ist ein **Singleton** — es gibt nur dieses eine Dokument, kein „+ Erstellen" nötig, es erscheint direkt oben in der Navigation.
**Auswirkung bei Veröffentlichung:** Ändert gleichzeitig die sichtbaren Öffnungszeiten auf der Startseite, der Kontaktseite, im Header-Öffnungsstatus-Ticker **und** in den strukturierten Daten (Google-Suchergebnisse) — alle Stellen lesen aus genau dieser einen Quelle, es gibt keine zweite Stelle, die veraltet bleiben könnte (das wurde in einer früheren Prüfung dieser Sitzung im Code bestätigt).

### 5. Urlaub und Sonderöffnungszeiten (`closurePeriod`)
**Aktuell real im System:** 0 aktive Einträge (aktuell kein Urlaub eingetragen).
**Neuen Urlaub eintragen:** „+ Erstellen" → Von-Datum, Bis-Datum, Grund (z. B. „Sommerurlaub", DE/TR), optional Vertretungsarzt (Name/Telefon/Adresse), „Aktiv"-Schalter auf „Ja" lassen → „Publish".
**Auswirkung:** Erscheint nach dem nächsten Build als Hinweis auf Startseite und Kontaktseite. **Wichtig:** Ein Eintrag mit „Aktiv" = Nein wird komplett ignoriert — so kannst du einen Urlaub im Voraus anlegen, ohne dass er sofort sichtbar wird, und ihn erst kurz vorher aktivieren.
**Kein automatisches Ablaufen:** Die Website prüft beim Bauen keine Datums-Fenster automatisch weg — ein abgelaufener Urlaubseintrag bleibt sichtbar, bis du ihn selbst auf „Aktiv: Nein" setzt oder löschst. Das ist bewusst so (kein Server, der das automatisch prüfen könnte), also bitte nach Ende des Urlaubs manuell deaktivieren.

### 6. Ankündigungen (`announcement`)
**Aktuell real im System:** 1 Eintrag (Status: „regulär geöffnet", unauffällig/informativ).
**Bearbeitbar:** Titel, Text (DE/TR), Art (Info/Warnung/Dringend — bestimmt die Farbe), Priorität (bei mehreren aktiven Mitteilungen gewinnt die höhere Zahl), optionaler Zeitraum (Beginn/Ende), optionaler Link, „Aktiv"-Schalter.
**Auswirkung:** Erscheint im „Aktuelles"-Menü der Website-Navigation.

### 7. Medizinische Leistungen (`service`)
**Aktuell real im System:** 7 Einträge (Allgemeine HNO, Kinder-HNO, Allergologie, Hörtest, Schwindel, Schnarchen, Stimmstörungen) — Inhalt in dieser Sitzung mit der Live-Website verglichen: identisch.
**Bearbeitbar:** H1-Überschrift, Meta-Titel/-Beschreibung (SEO, siehe Punkt 9), Keywords, Einleitungstext, Symptome-Liste, Behandlungen-Liste, FAQ (Frage/Antwort-Paare), Bild — jeweils für Deutsch und Türkisch getrennt.
**Wichtig:** Der „Slug" (die URL, z. B. `/leistungen/allergologie`) ist bewusst eine feste Auswahlliste, kein freier Text — du kannst also keinen neuen Leistungstyp mit einer eigenen neuen URL erstellen, nur die bestehenden 7 inhaltlich bearbeiten. Das ist Absicht (jede URL braucht eine passende Seiten-Route im Code).
**Medizinische Inhalte:** Änderungen an Symptomen/Behandlungen sollten fachlich durch Dr. Alici freigegeben sein, bevor sie veröffentlicht werden — das Studio selbst prüft das nicht automatisch.

### 8. Blog (`blogPost`)
**Aktuell real im System:** 2 Beiträge (Ohrenschmerzen beim Kind, Allergietest in Wien).
**Bearbeitbar:** Titel, Slug (wird automatisch aus dem deutschen Titel vorgeschlagen, bei Bedarf änderbar), Datum, Kurzbeschreibung, Inhalt, Keywords, Titelbild.
**Besonderheit gegenüber Leistungen:** Beim Blog **kannst** du einen komplett neuen Beitrag mit neuem Slug anlegen — anders als bei Leistungen wird hier nicht nur Bestehendes überschrieben, sondern ein neuer Beitrag erscheint nach Veröffentlichung und nächstem Build automatisch unter einer eigenen neuen URL.

### 9. Website-Einstellungen (`siteSettings`, Singular-Dokument)
**Bearbeitbar:** Ordinationsname, Domain, Telefon (für Anruf-Links, nur Ziffern/+), Telefon-Anzeigetext, E-Mail, Datenschutz-E-Mail, Adresse (Straße/Stadt/PLZ/Land), Logo, Social-Media-Links, Google-Maps-/Routenplaner-/Bewertungs-URLs, die 5 zentralen „Editierbaren Bilder" (siehe Punkt 3), Text-Überschreibungen für Hero/About/Hours, **und globale SEO-Einstellungen** (Standard-Meta-Beschreibung, Standard-OG-Bild für Social-Media-Vorschauen).
**Besonderheit:** Auch dies ist ein **Singleton** — nur ein Dokument für die ganze Website.
**Vorsicht:** Telefonnummer/Adresse/E-Mail sind die Daten, die auch in den strukturierten Daten (Google) und im Impressum erscheinen — Änderungen hier wirken sich website-weit aus.

### Rechtliche Inhalte (`legalDocument`)
**Aktuell real im System:** 8 Einträge (Impressum, Datenschutz, Haftungsausschluss, Cookie-Richtlinie — jeweils DE und TR getrennt).
**Bearbeitbar:** Titel, „Zuletzt aktualisiert"-Datum, Abschnitte (Überschrift, Absätze, optionale Liste, optionale Anker-ID).
**Wichtig — bitte beachten:** Das Schema selbst merkt ausdrücklich an, dass Änderungen an diesen Texten **vor Veröffentlichung fachlich/rechtlich geprüft** werden sollten (Impressum/Datenschutz sind rechtlich bindend) — das Studio lässt dich zwar technisch jederzeit speichern und veröffentlichen, aber eine Rechtsprüfung findet nicht automatisch statt.

### SEO-Metadaten — wo sie im Schema wirklich unterstützt werden
- **Pro Leistung** (`service`): eigener Meta-Titel, eigene Meta-Beschreibung, eigene Keywords (DE/TR).
- **Pro Blogbeitrag** (`blogPost`): Titel und Kurzbeschreibung werden als Seitentitel/-beschreibung verwendet, dazu Keywords.
- **Website-weit** (`siteSettings.seo`): Standard-Meta-Beschreibung und Standard-Vorschaubild für Seiten ohne eigene SEO-Felder.
- **Nicht im Schema:** Einzelne Seiten wie Kontakt, Team, Startseite haben aktuell keine eigenen SEO-Felder in Sanity — deren Meta-Daten kommen weiterhin aus dem Code (den in einer früheren Sitzungsrunde bereits reparierten, eindeutigen Titeln/Beschreibungen je Seite).

## Änderungen kontrollieren

- Jedes Dokument zeigt oben rechts ein Uhr-Symbol mit der **Versionsgeschichte** — du siehst, wer wann was geändert hat, und kannst eine frühere Version ansehen.
- Solange ein Dokument nur als Entwurf existiert, siehst du im Studio ein gelbes Punkt-Symbol neben dem Titel — ein Hinweis, dass hier etwas Unveröffentlichtes wartet.

## Fehler rückgängig machen

- **Noch nicht veröffentlicht:** Einfach die Änderung im Feld zurücksetzen (oder in der Versionsgeschichte die vorherige Version öffnen und übernehmen) — da noch nichts veröffentlicht wurde, ist auf der echten Website nichts passiert.
- **Bereits veröffentlicht, aber Fehler bemerkt:** Über die Versionsgeschichte die vorherige, korrekte Version öffnen, deren Inhalt übernehmen und erneut „Publish" klicken.
- **Größeres Problem:** In dieser Sitzung wurde ein vollständiger Rückwechsel-Test durchgeführt — ein Website-Build **ohne** Sanity-Datenquelle (`CONTENT_SOURCE` nicht gesetzt) zeigt zuverlässig wieder exakt den bisherigen, lokal gespeicherten Inhalt. Im äußersten Notfall ist also ein Build ohne Sanity-Anbindung immer ein funktionierender Rückfallplan, unabhängig vom Zustand der Sanity-Daten.

## Screenshots

Ein Screenshot der Studio-Oberfläche **vor dem Login** liegt unter `docs/design/studio-login-screen.png` (zeigt aktuell den oben beschriebenen CORS-Fehler als Entwicklungsserver-Hinweis — verschwindet nach dem CORS-Fix). Screenshots der **eingeloggten** Bearbeitungsoberfläche konnten in dieser Sitzung nicht erstellt werden, da das Einloggen deine eigenen, persönlichen Zugangsdaten erfordert, die ich nicht verwende und nicht verwenden sollte — nach dem CORS-Fix und deinem eigenen Login siehst du die Oberfläche direkt und live im Browser.
