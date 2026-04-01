const fs = require('node:fs');
const path = require('node:path');

const STORE_PATH = path.join(__dirname, '../../data/whitelist.json');

function ensureStore() {
  if (!fs.existsSync(STORE_PATH)) {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify({ guildIds: [] }, null, 2));
  }
}

function loadStore() {
  ensureStore();
  const raw = fs.readFileSync(STORE_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  return new Set(parsed.guildIds || []);
}

function saveStore(guildIds) {
  fs.writeFileSync(STORE_PATH, JSON.stringify({ guildIds: [...guildIds] }, null, 2));
}

function isWhitelisted(guildId) {
  const ids = loadStore();
  return ids.has(guildId);
}

function addGuild(guildId) {
  const ids = loadStore();
  ids.add(guildId);
  saveStore(ids);
}

function removeGuild(guildId) {
  const ids = loadStore();
  ids.delete(guildId);
  saveStore(ids);
}

module.exports = {
  isWhitelisted,
  addGuild,
  removeGuild,
};
