const fs = require('node:fs');
const path = require('node:path');

const STORE_PATH = path.join(__dirname, '../../data/guildSettings.json');

const DEFAULT_SETTINGS = {
  modules: {
    moderation: true,
    tickets: true,
    team: false,
    community: false,
    partners: false,
    factions: false,
    leave: false,
    security: true,
    news: false,
    voice: true,
  },
  channels: {
    ticketChannelId: null,
    logsChannelId: null,
    voiceWaitingRoomId: null,
    voiceCategoryId: null,
  },
};

function ensureStore() {
  if (!fs.existsSync(STORE_PATH)) {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify({ guilds: {} }, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
}

function writeStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function getGuildSettings(guildId) {
  const store = readStore();
  const current = store.guilds[guildId] || DEFAULT_SETTINGS;
  return JSON.parse(JSON.stringify(current));
}

function updateGuildSettings(guildId, updater) {
  const store = readStore();
  const current = store.guilds[guildId] || JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  const next = updater(current);
  store.guilds[guildId] = next;
  writeStore(store);
  return next;
}

module.exports = {
  getGuildSettings,
  updateGuildSettings,
  DEFAULT_SETTINGS,
};
