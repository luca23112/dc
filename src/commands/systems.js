const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGuildSettings } = require('../services/guildSettingsStore');

module.exports = {
  data: new SlashCommandBuilder().setName('systems').setDescription('Zeigt alle aktivierten Systeme auf diesem Server'),

  async execute(interaction) {
    if (!interaction.guildId) {
      await interaction.reply({ content: '❌ Nur im Server nutzbar.', ephemeral: true });
      return;
    }

    const settings = getGuildSettings(interaction.guildId);
    const modules = Object.entries(settings.modules)
      .map(([name, enabled]) => `• ${name}: ${enabled ? '✅ aktiv' : '❌ aus'}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle('🧩 Systemübersicht')
      .setDescription(modules)
      .addFields(
        { name: 'Ticket-Kanal', value: settings.channels.ticketChannelId ? `<#${settings.channels.ticketChannelId}>` : 'nicht gesetzt' },
        { name: 'Voice Warteraum', value: settings.channels.voiceWaitingRoomId ? `<#${settings.channels.voiceWaitingRoomId}>` : 'nicht gesetzt' },
      )
      .setFooter({ text: 'Made by Apex' })
      .setColor(0x7289da);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
