# ⚙️ Discord Bot System – Übersicht

## 🧱 Technische Basis

- Bot-Sprache/Runtime: **Node.js**
- Empfohlenes Framework: **discord.js v14**
- Steuerung parallel über **Dashboard** und **Slash-Commands**

---

## 🌐 Zentrales Dashboard & Command-Steuerung

Das System kann vollständig über **Dashboard** und **Slash-Commands** verwaltet werden.

### Kernprinzip
- Alle Systeme sind über `/settings` konfigurierbar
- Alternative Steuerung über Slash-Commands
- Intuitive Web-Oberfläche (Dashboard)
- Änderungen wirken in Echtzeit
- Eigene Inhalte können direkt im Dashboard erstellt werden

---

## 🔐 Zugriff & Whitelist-System

### 👑 Bot Owner (2 Personen)
- Können Server zur Whitelist hinzufügen
- Können Server von der Whitelist entfernen
- Haben vollen Zugriff auf alle Systeme
- Verwalten das Bot-Profil pro Server individuell

### ✅ Whitelist-Server
Nur freigegebene Server haben Zugriff auf:
- 🌐 Dashboard
- ⚙️ Erweiterte Einstellungen
- 🔧 Alle Features

### 👥 Server-Admins (auf Whitelist-Servern)
- Dashboard nutzen
- Systeme konfigurieren
- Einstellungen verwalten

---

## 🛠️ Hauptsysteme

### 🛡️ Moderation
- Ban / Kick / Timeout
- Automod (Spam, Caps, Beleidigungen)
- Warnsystem
- Moderations-Logs

### 🎫 Ticketsysteme (inkl. Modmail)
Kombination aus klassischen Tickets und DM-Support.

- Server-Tickets über Panels (Buttons / Dropdowns)
- Modmail-Ablauf: User schreibt DM → Ticket wird im Server erstellt → Team antwortet per DM
- Auto-Close, Transkripte, Anti-Spam, Blacklist
- Optional anonym

### 👥 Teamverwaltung
- Rangsystem (Uprank / Downrank)
- Teamliste
- Aktivitäts-Tracking
- Beförderungs-Logs

### 📊 Community Features
- Levelsystem
- Umfragen
- Vorschläge
- Invite-Tracking

### 🤝 Partnersystem
- Partner hinzufügen / bearbeiten / löschen
- Partnerliste
- Logs

### 🏢 Fraktionssystem
- Fraktionen erstellen & verwalten
- Rollen festlegen
- Verwarnungen

### 📅 Abmeldesystem
- Abmeldungen mit Zeitraum & Grund
- Bearbeiten / Löschen
- Logs

### 🔐 Security-System
- Anti-Raid-Schutz
- Whitelist-System
- Sicherheits-Logs

---

## 🎨 Erweiterte Dashboard-Features

### 🧩 Custom Embed Generator
- Eigene Embeds im Dashboard erstellen
- Titel, Beschreibung und Farben frei wählbar
- Bilder, Thumbnails & Footer
- Live-Vorschau
- Direkt in Kanäle senden

### 📅 Event-System
- Events erstellen & verwalten
- Automatische Ankündigungen
- Teilnehmer-System (Buttons)
- Erinnerungen
- Event-Logs

### ⚙️ Command-Generator (Dashboard)
- Eigene Commands ohne Code erstellen
- Antworten / Embeds definieren
- Permissions festlegen
- Individuelle Trigger
- Verwaltung im Dashboard

### 🤖 Bot-Profil-Verwaltung (Owner only, pro Server)
Nur Bot Owner können je Server:
- Bot-Namen ändern
- Bot-Avatar ändern
- Bot-Banner ändern

Steuerung über:
- 🌐 Dashboard
- Slash-Commands (z. B. `/bot-profile`)

### 📣 News-System
- TikTok-, YouTube- & Twitch-News direkt abrufbar
- Benachrichtigungen im Server oder per Dashboard konfigurierbar
- Update-Intervalle einstellbar
- Kanalspezifische Postings
- Unterstützung für mehrere Accounts / Channels
- Live-Vorschau von Posts / Videos

---

## ⚙️ Setup-Systeme
- Verifizierungssystem
- Willkommenssystem
- Bewerbungs-System
- Logs
- Stats
- Support-Warteraum

👉 Alles über Dashboard oder `/settings` einstellbar.

---

## 🎮 Zusatzfunktionen (optional)
- Minispiele
- Daily Rewards
- Gewinnspiele
- Voice-System

---

## 💡 Besonderheiten
- 🔒 Zugriff nur für Whitelist-Server
- 👑 2 Bot Owner kontrollieren alles
- 🤖 Bot-Profil pro Server individuell anpassbar
- 🌐 Dashboard + Commands parallel nutzbar
- 🎫 Ticketsysteme (inkl. Modmail) integriert
- 🎨 Eigene Embeds & Commands erstellbar
- 📅 Event-System enthalten
- 📣 TikTok / YouTube / Twitch News integriert
- ⚙️ Komplett konfigurierbar
