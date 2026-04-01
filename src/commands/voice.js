const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { updateGuildSettings, getGuildSettings } = require('../services/guildSettingsStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('voice')
    .setDescription('Voice Support System konfigurieren')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('setup')
        .setDescription('Setzt Warteraum + Kategorie für Voice Support')
        .addChannelOption((opt) =>
          opt
            .setName('waiting_room')
            .setDescription('Voice-Warteraum')
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true),
        )
        .addChannelOption((opt) =>
          opt
            .setName('category')
            .setDescription('Kategorie für temporäre Voice-Räume')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true),
        ),
    )
    .addSubcommand((sub) => sub.setName('status').setDescription('Zeigt Voice-System Status'))
    .addSubcommand((sub) => sub.setName('disable').setDescription('Deaktiviert das Voice-Modul')),

  async execute(interaction) {
    if (!interaction.guildId) {
      await interaction.reply({ content: '❌ Nur im Server möglich.', ephemeral: true });
      return;
    }

    const sub = interaction.options.getSubcommand();

    if (sub === 'setup') {
      const waitingRoom = interaction.options.getChannel('waiting_room', true);
      const category = interaction.options.getChannel('category', true);

      updateGuildSettings(interaction.guildId, (settings) => {
        settings.modules.voice = true;
        settings.channels.voiceWaitingRoomId = waitingRoom.id;
        settings.channels.voiceCategoryId = category.id;
        return settings;
      });

      await interaction.reply({
        content: `✅ Voice Support aktiv. Warteraum: ${waitingRoom} | Kategorie: ${category}`,
        ephemeral: true,
      });
      return;
    }

    if (sub === 'disable') {
      updateGuildSettings(interaction.guildId, (settings) => {
        settings.modules.voice = false;
        return settings;
      });

      await interaction.reply({ content: '✅ Voice Support deaktiviert.', ephemeral: true });
      return;
    }

    const settings = getGuildSettings(interaction.guildId);
    await interaction.reply({
      content: [
        `Voice Modul: ${settings.modules.voice ? '✅ aktiv' : '❌ inaktiv'}`,
        `Warteraum: ${settings.channels.voiceWaitingRoomId ? `<#${settings.channels.voiceWaitingRoomId}>` : 'nicht gesetzt'}`,
        `Kategorie: ${settings.channels.voiceCategoryId ? `<#${settings.channels.voiceCategoryId}>` : 'nicht gesetzt'}`,
      ].join('\n'),
      ephemeral: true,
    });
  },
};
