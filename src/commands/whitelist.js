const { SlashCommandBuilder } = require('discord.js');
const { addGuild, removeGuild, listGuilds } = require('../services/whitelistStore');

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
    )
    .addSubcommand((sub) => sub.setName('list').setDescription('Zeigt alle whitelisted Server')),

  async execute(interaction, context) {
    const sub = interaction.options.getSubcommand();

    if (!context.isOwner(interaction.user.id)) {
      await interaction.reply({ content: '❌ Nur Bot Owner dürfen die Whitelist verwalten.', ephemeral: true });
      return;
    }

    if (sub === 'add') {
      const guildId = interaction.options.getString('guild_id', true);
      addGuild(guildId);
      await interaction.reply({ content: `✅ Server ${guildId} wurde zur Whitelist hinzugefügt.`, ephemeral: true });
      return;
    }

    if (sub === 'remove') {
      const guildId = interaction.options.getString('guild_id', true);
      removeGuild(guildId);
      await interaction.reply({ content: `✅ Server ${guildId} wurde von der Whitelist entfernt.`, ephemeral: true });
      return;
    }

    const guilds = listGuilds();
    await interaction.reply({
      content: guilds.length
        ? `✅ **Whitelist-Liste**\n${guilds.map((g, i) => `${i + 1}. ${g}`).join('\n')}`
        : 'ℹ️ Die Whitelist ist aktuell leer.',
      ephemeral: true,
    });
  },
};
