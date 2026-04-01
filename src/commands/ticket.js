const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { getGuildSettings } = require('../services/guildSettingsStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Erstellt ein Support-Ticket')
    .addStringOption((opt) =>
      opt.setName('grund').setDescription('Warum brauchst du Support?').setRequired(true),
    ),

  async execute(interaction) {
    if (!interaction.guildId) {
      await interaction.reply({ content: '❌ Dieser Command funktioniert nur in Servern.', ephemeral: true });
      return;
    }

    const settings = getGuildSettings(interaction.guildId);

    if (!settings.modules.tickets) {
      await interaction.reply({ content: '❌ Das Ticket-Modul ist deaktiviert.', ephemeral: true });
      return;
    }

    if (!settings.channels.ticketChannelId) {
      await interaction.reply({
        content: '❌ Kein Ticket-Kanal gesetzt. Nutze `/settings ticket-channel`.',
        ephemeral: true,
      });
      return;
    }

    const baseChannel = interaction.guild.channels.cache.get(settings.channels.ticketChannelId);
    if (!baseChannel || baseChannel.type !== ChannelType.GuildText) {
      await interaction.reply({ content: '❌ Der konfigurierte Ticket-Kanal ist ungültig.', ephemeral: true });
      return;
    }

    const reason = interaction.options.getString('grund', true);
    const safeName = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40) || 'user';

    const thread = await baseChannel.threads.create({
      name: `ticket-${safeName}`,
      autoArchiveDuration: 1440,
      reason: `Ticket erstellt von ${interaction.user.tag}`,
    });

    await thread.send(`🎫 Ticket von <@${interaction.user.id}>\n**Grund:** ${reason}`);
    await interaction.reply({ content: `✅ Ticket erstellt: ${thread.toString()}`, ephemeral: true });
  },
};
