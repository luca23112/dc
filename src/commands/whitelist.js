const { SlashCommandBuilder } = require('discord.js');
const { addGuild, removeGuild } = require('../services/whitelistStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Verwaltet die Server-Whitelist (nur Bot Owner)')
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Fügt einen Server zur Whitelist hinzu')
        .addStringOption((opt) => opt.setName('guild_id').setDescription('Server-ID').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Entfernt einen Server von der Whitelist')
        .addStringOption((opt) => opt.setName('guild_id').setDescription('Server-ID').setRequired(true)),
    ),

  async execute(interaction, context) {
    const guildId = interaction.options.getString('guild_id', true);
    const sub = interaction.options.getSubcommand();

    if (!context.isOwner(interaction.user.id)) {
      await interaction.reply({ content: '❌ Nur Bot Owner dürfen die Whitelist verwalten.', ephemeral: true });
      return;
    }

    if (sub === 'add') {
      addGuild(guildId);
      await interaction.reply({ content: `✅ Server ${guildId} wurde zur Whitelist hinzugefügt.`, ephemeral: true });
      return;
    }

    if (sub === 'remove') {
      removeGuild(guildId);
      await interaction.reply({ content: `✅ Server ${guildId} wurde von der Whitelist entfernt.`, ephemeral: true });
    }
  },
};
