const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildSettings, updateGuildSettings, DEFAULT_SETTINGS } = require('../services/guildSettingsStore');

const moduleChoices = Object.keys(DEFAULT_SETTINGS.modules);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Verwaltet Server-Einstellungen')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('status')
        .setDescription('Zeigt die aktuellen Modul- und Kanal-Einstellungen'),
    )
    .addSubcommand((sub) =>
      sub
        .setName('module')
        .setDescription('Aktiviert/deaktiviert ein Modul')
        .addStringOption((opt) =>
          opt
            .setName('name')
            .setDescription('Modulname')
            .setRequired(true)
            .addChoices(...moduleChoices.map((name) => ({ name, value: name }))),
        )
        .addBooleanOption((opt) =>
          opt.setName('enabled').setDescription('true = aktiv / false = inaktiv').setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('ticket-channel')
        .setDescription('Setzt den Ticket-Kanal')
        .addChannelOption((opt) =>
          opt.setName('channel').setDescription('Kanal für neue Tickets').setRequired(true),
        ),
    ),

  async execute(interaction) {
    if (!interaction.guildId) {
      await interaction.reply({ content: '❌ Dieser Command funktioniert nur in Servern.', ephemeral: true });
      return;
    }

    const sub = interaction.options.getSubcommand();

    if (sub === 'status') {
      const settings = getGuildSettings(interaction.guildId);
      const modules = Object.entries(settings.modules)
        .map(([name, enabled]) => `• ${name}: ${enabled ? '✅' : '❌'}`)
        .join('\n');

      await interaction.reply({
        content: [
          '⚙️ **Aktuelle Settings**',
          '',
          '**Module:**',
          modules,
          '',
          `**Ticket-Kanal:** ${settings.channels.ticketChannelId ? `<#${settings.channels.ticketChannelId}>` : 'nicht gesetzt'}`,
          `**Logs-Kanal:** ${settings.channels.logsChannelId ? `<#${settings.channels.logsChannelId}>` : 'nicht gesetzt'}`,
        ].join('\n'),
        ephemeral: true,
      });
      return;
    }

    if (sub === 'module') {
      const moduleName = interaction.options.getString('name', true);
      const enabled = interaction.options.getBoolean('enabled', true);

      updateGuildSettings(interaction.guildId, (settings) => {
        settings.modules[moduleName] = enabled;
        return settings;
      });

      await interaction.reply({
        content: `✅ Modul **${moduleName}** wurde auf **${enabled ? 'aktiv' : 'inaktiv'}** gesetzt.`,
        ephemeral: true,
      });
      return;
    }

    if (sub === 'ticket-channel') {
      const channel = interaction.options.getChannel('channel', true);

      updateGuildSettings(interaction.guildId, (settings) => {
        settings.channels.ticketChannelId = channel.id;
        return settings;
      });

      await interaction.reply({
        content: `✅ Ticket-Kanal wurde auf ${channel} gesetzt.`,
        ephemeral: true,
      });
    }
  },
};
