const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addWarning, getWarnings } = require('../services/moderationStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Verwarnungssystem')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Fügt eine Verwarnung hinzu')
        .addUserOption((opt) => opt.setName('user').setDescription('User').setRequired(true))
        .addStringOption((opt) => opt.setName('reason').setDescription('Grund').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('list')
        .setDescription('Zeigt Verwarnungen eines Users')
        .addUserOption((opt) => opt.setName('user').setDescription('User').setRequired(true)),
    ),

  async execute(interaction) {
    if (!interaction.guildId) {
      await interaction.reply({ content: '❌ Nur in Servern nutzbar.', ephemeral: true });
      return;
    }

    const sub = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user', true);

    if (sub === 'add') {
      const reason = interaction.options.getString('reason', true);
      const list = addWarning(interaction.guildId, user.id, interaction.user.id, reason);
      await interaction.reply({
        content: `✅ ${user.tag} verwarnt. Gesamtverwarnungen: ${list.length}`,
        ephemeral: true,
      });
      return;
    }

    const list = getWarnings(interaction.guildId, user.id);
    if (!list.length) {
      await interaction.reply({ content: `ℹ️ ${user.tag} hat keine Verwarnungen.`, ephemeral: true });
      return;
    }

    const text = list
      .map((w, i) => `${i + 1}. ${w.reason} | Moderator: <@${w.moderatorId}> | ${w.createdAt}`)
      .join('\n');

    await interaction.reply({ content: `⚠️ Verwarnungen für ${user.tag}:\n${text}`, ephemeral: true });
  },
};
