const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Öffnet die Grundeinstellungen für das System')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.reply({
      content:
        '⚙️ Einstellungen sind aktiv. Hier kannst du später Moderation, Tickets, Events, News und weitere Module konfigurieren.',
      ephemeral: true,
    });
  },
};
