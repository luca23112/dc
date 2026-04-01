# Discord Bot (Node.js)

Grundgerüst für einen Discord-Bot in **Node.js** mit:
- Whitelist-System
- 2+ Bot Ownern (konfigurierbar)
- `/settings` als zentrale Einstiegskonfiguration
- `/whitelist add|remove` (nur Owner)

## Setup

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
2. `.env.example` nach `.env` kopieren und Werte eintragen.
3. Bot starten:
   ```bash
   npm start
   ```

## Enthaltene Commands
- `/ping`
- `/settings`
- `/whitelist add guild_id:<id>`
- `/whitelist remove guild_id:<id>`
