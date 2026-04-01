const dotenv = require('dotenv');

dotenv.config();

const required = ['DISCORD_TOKEN', 'CLIENT_ID'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Fehlende Umgebungsvariable: ${key}`);
  }
}

const botOwners = (process.env.BOT_OWNERS || '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID || null,
  botOwners,
};
