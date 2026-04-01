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
2. `/settings ticket-channel channel:<support-channel>`
3. `/panel ticket`
4. `/panel settings`
5. `/bot-profile set name:Apex Support Bot footer:Made by Apex description:Support Bot von Apex Service link:https://discord.gg/h7QFEWZENY`
6. `/bot-profile apply`
7. `/about`

## Hinweis zu Discord-Limits

- Username/Avatar sind bei Discord **global**, nicht wirklich pro Server.
- Banner wird im Store gespeichert; direkter Banner-Apply ist im Basisscaffold nicht automatisch aktiviert.
