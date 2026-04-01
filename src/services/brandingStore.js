const fs = require('node:fs');
const path = require('node:path');

const STORE_PATH = path.join(__dirname, '../../data/branding.json');

const DEFAULT_STORE = {
  global: {
    defaultEmbedFooter: 'Made by Apex',
    defaultDescription: 'Support Bot von Apex Service',
    defaultInviteLink: 'https://discord.gg/h7QFEWZENY',
  },
  guildProfiles: {},
};

function ensureStore() {
  if (!fs.existsSync(STORE_PATH)) {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
}

function writeStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function getBranding(guildId) {
  const store = readStore();
  const profile = store.guildProfiles[guildId] || {
    name: 'Apex Support Bot',
    avatarUrl: null,
    bannerUrl: null,
    description: store.global.defaultDescription,
    inviteLink: store.global.defaultInviteLink,
    footer: store.global.defaultEmbedFooter,
  };

  return {
    global: store.global,
    profile,
  };
}

function updateGuildProfile(guildId, updater) {
  const store = readStore();
  const current = getBranding(guildId).profile;
  const next = updater(current);
  store.guildProfiles[guildId] = next;
  writeStore(store);
  return next;
}

module.exports = {
  getBranding,
  updateGuildProfile,
};
