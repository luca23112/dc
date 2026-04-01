# Discord Bot (Node.js) – Apex Support Bot

## Bereits umgesetzt (mit GUIs + Embeds)

- ✅ Whitelist-System
- ✅ Bot Owner IDs
- ✅ `/settings` (status/module/ticket-channel)
- ✅ `/ticket` (Thread-Erstellung)
- ✅ `/bot-profile` (show/set/apply)
- ✅ `/about` mit Embed + Footer **Made by Apex**
- ✅ `/panel ticket` → GUI-Button + Modal für Ticket-Erstellung
- ✅ `/panel settings` → GUI-Dropdown für Modul Aktivieren/Deaktivieren
- ✅ `/voice` Voice Support System (Warteraum → Auto-Voice-Raum)
- ✅ `/warn` Verwarnungssystem (add/list)
- ✅ `/poll` Umfrage-Embed
- ✅ `/suggest` Vorschlags-Embed
- ✅ `/event` Event-Embed

## Schnellstart

```bash
npm install
cp .env.example .env
npm start
```

## `.env` Beispiel

```env
DISCORD_TOKEN=...
CLIENT_ID=...
BOT_OWNERS=1028382376058962040,1457008845757878359
GUILD_ID=deine_test_server_id
```

## Wichtige Commands

1. `/whitelist add guild_id:<dein_server>`
2. `/whitelist list` (Whitelist-Liste anzeigen)
3. `/settings ticket-channel channel:<support-channel>`
4. `/panel ticket`
5. `/panel settings`
6. `/bot-profile set name:Apex Support Bot footer:Made by Apex description:Support Bot von Apex Service link:https://discord.gg/h7QFEWZENY`
7. `/bot-profile apply`
8. `/voice setup waiting_room:<voice> category:<kategorie>`
9. `/voice status`
10. `/warn add user:<user> reason:<grund>`
11. `/warn list user:<user>`
12. `/poll frage:<frage>`
13. `/suggest text:<vorschlag>`
14. `/event titel:<titel> zeit:<zeit> info:<info>`
15. `/systems`
16. `/about`

## Hinweis zu Discord-Limits

- Username/Avatar sind bei Discord **global**, nicht wirklich pro Server.
- Banner wird im Store gespeichert; direkter Banner-Apply ist im Basisscaffold nicht automatisch aktiviert.
