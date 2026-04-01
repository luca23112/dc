const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ChannelType,
} = require('discord.js');
const { getGuildSettings, updateGuildSettings } = require('../services/guildSettingsStore');

function buildStatusEmbed(guildId) {
  const settings = getGuildSettings(guildId);
  const moduleLines = Object.entries(settings.modules)
    .map(([name, enabled]) => `• ${name}: ${enabled ? '✅' : '❌'}`)
    .join('\n');

  return new EmbedBuilder()
    .setTitle('⚙️ Module Status')
    .setDescription(moduleLines || 'Keine Module')
    .setFooter({ text: 'Made by Apex' })
    .setColor(0x3498db);
}

async function handleButton(interaction) {
  if (interaction.customId !== 'ticket:create') return false;

  const modal = new ModalBuilder().setCustomId('ticket:modal:create').setTitle('Ticket erstellen');
  const reasonInput = new TextInputBuilder()
    .setCustomId('reason')
    .setLabel('Dein Anliegen')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(3)
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
  await interaction.showModal(modal);
  return true;
}

async function handleSelectMenu(interaction) {
  if (interaction.customId !== 'settings:module:select') return false;

  const [moduleName, action] = interaction.values[0].split(':');
  const enabled = action === 'on';

  updateGuildSettings(interaction.guildId, (settings) => {
    settings.modules[moduleName] = enabled;
    return settings;
  });

  await interaction.reply({
    content: `✅ Modul \`${moduleName}\` wurde ${enabled ? 'aktiviert' : 'deaktiviert'}.`,
    embeds: [buildStatusEmbed(interaction.guildId)],
    ephemeral: true,
  });
  return true;
}

async function handleModalSubmit(interaction) {
  if (interaction.customId !== 'ticket:modal:create') return false;

  const settings = getGuildSettings(interaction.guildId);
  if (!settings.channels.ticketChannelId) {
    await interaction.reply({
      content: '❌ Kein Ticket-Kanal gesetzt. Nutze `/settings ticket-channel`.',
      ephemeral: true,
    });
    return true;
  }

  const baseChannel = interaction.guild.channels.cache.get(settings.channels.ticketChannelId);
  if (!baseChannel || baseChannel.type !== ChannelType.GuildText) {
    await interaction.reply({ content: '❌ Ticket-Kanal ist ungültig.', ephemeral: true });
    return true;
  }

  const reason = interaction.fields.getTextInputValue('reason');
  const safeName = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40) || 'user';

  const thread = await baseChannel.threads.create({
    name: `ticket-${safeName}`,
    autoArchiveDuration: 1440,
    reason: `Ticket erstellt via GUI von ${interaction.user.tag}`,
  });

  const embed = new EmbedBuilder()
    .setTitle('🎫 Neues Ticket')
    .setDescription(`User: <@${interaction.user.id}>\nGrund: ${reason}`)
    .setFooter({ text: 'Made by Apex' })
    .setColor(0xe67e22);

  await thread.send({ embeds: [embed] });
  await interaction.reply({ content: `✅ Ticket erstellt: ${thread.toString()}`, ephemeral: true });
  return true;
}

module.exports = {
  handleButton,
  handleSelectMenu,
  handleModalSubmit,
};
