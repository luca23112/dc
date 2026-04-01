const fs = require('node:fs');
const path = require('node:path');

const STORE_PATH = path.join(__dirname, '../../data/moderation.json');

function ensureStore() {
  if (!fs.existsSync(STORE_PATH)) {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify({ warnings: {} }, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
}

function writeStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function addWarning(guildId, userId, moderatorId, reason) {
  const store = readStore();
  const key = `${guildId}:${userId}`;
  const list = store.warnings[key] || [];
  list.push({ moderatorId, reason, createdAt: new Date().toISOString() });
  store.warnings[key] = list;
  writeStore(store);
  return list;
}

function getWarnings(guildId, userId) {
  const store = readStore();
  return store.warnings[`${guildId}:${userId}`] || [];
}

module.exports = { addWarning, getWarnings };
