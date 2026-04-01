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
const { handleButton, handleSelectMenu, handleModalSubmit } = require('./interactions/guiHandlers');
const { handleVoiceStateUpdate } = require('./interactions/voiceSupport');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
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

  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commandData });
    console.log(`✅ Slash-Commands für GUILD_ID=${config.guildId} registriert.`);
    return;
  }

  await rest.put(Routes.applicationCommands(config.clientId), { body: commandData });
  console.log('✅ Globale Slash-Commands registriert (kann bis zu 1h dauern).');
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Eingeloggt als ${readyClient.user.tag}`);
  try {
    await registerCommands();
  } catch (error) {
    console.error('❌ Fehler bei der Command-Registrierung:', error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.guildId && !isWhitelisted(interaction.guildId) && !isOwner(interaction.user.id)) {
    if (interaction.isChatInputCommand() || interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
      await interaction.reply({
        content: '🔒 Dieser Server ist nicht auf der Whitelist. Bitte kontaktiere einen Bot Owner.',
        ephemeral: true,
      });
    }
    return;
  }

  try {
    if (interaction.isButton()) {
      if (await handleButton(interaction)) return;
    }

    if (interaction.isStringSelectMenu()) {
      if (await handleSelectMenu(interaction)) return;
    }

    if (interaction.isModalSubmit()) {
      if (await handleModalSubmit(interaction)) return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction, { isOwner });
  } catch (error) {
    console.error('❌ Command-Fehler:', error);
    const payload = { content: 'Beim Ausführen ist ein Fehler aufgetreten.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload);
      return;
    }
    await interaction.reply(payload);
  }
});


client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    await handleVoiceStateUpdate(oldState, newState);
  } catch (error) {
    console.error('❌ VoiceState Fehler:', error);
  }
});
client.login(config.token);
