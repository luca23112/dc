const fs = require('node:fs');
const path = require('node:path');
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
} = require('discord.js');
const config = require('./config');
const { isWhitelisted } = require('./services/whitelistStore');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
const commandData = [];

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
  commandData.push(command.data.toJSON());
}

function isOwner(userId) {
  return config.botOwners.includes(userId);
}

async function registerCommands() {
  const rest = new REST().setToken(config.token);
  await rest.put(Routes.applicationCommands(config.clientId), { body: commandData });
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Eingeloggt als ${readyClient.user.tag}`);
  try {
    await registerCommands();
    console.log('✅ Slash-Commands wurden registriert.');
  } catch (error) {
    console.error('❌ Fehler bei der Command-Registrierung:', error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  if (interaction.guildId && !isWhitelisted(interaction.guildId) && !isOwner(interaction.user.id)) {
    await interaction.reply({
      content: '🔒 Dieser Server ist nicht auf der Whitelist. Bitte kontaktiere einen Bot Owner.',
      ephemeral: true,
    });
    return;
  }

  try {
    await command.execute(interaction, { isOwner });
  } catch (error) {
    console.error('❌ Command-Fehler:', error);
    const payload = { content: 'Beim Ausführen des Commands ist ein Fehler aufgetreten.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload);
      return;
    }
    await interaction.reply(payload);
  }
});

client.login(config.token);
