const { SlashCommandBuilder } = require('discord.js');
const { updateGuildProfile, getBranding } = require('../services/brandingStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot-profile')
    .setDescription('Verwaltet Bot-Profil-Einstellungen (nur Bot Owner)')
    .addSubcommand((sub) => sub.setName('show').setDescription('Zeigt gespeicherte Profileinstellungen'))
    .addSubcommand((sub) =>
      sub
        .setName('set')
        .setDescription('Setzt Name/Beschreibung/Footer/Link für diesen Server')
        .addStringOption((opt) => opt.setName('name').setDescription('Anzeigename, z.B. Apex Support Bot').setRequired(false))
        .addStringOption((opt) => opt.setName('description').setDescription('Beschreibungstext').setRequired(false))
        .addStringOption((opt) => opt.setName('link').setDescription('Server-/Support-Link').setRequired(false))
        .addStringOption((opt) => opt.setName('footer').setDescription('Embed Footer Text').setRequired(false))
        .addStringOption((opt) => opt.setName('avatar_url').setDescription('Avatar-URL (optional)').setRequired(false))
        .addStringOption((opt) => opt.setName('banner_url').setDescription('Banner-URL (optional)').setRequired(false)),
    )
    .addSubcommand((sub) =>
      sub.setName('apply').setDescription('Wendet Name/Avatar auf den Bot an (globales Discord-Limit beachten)'),
    ),

  async execute(interaction, context) {
    if (!interaction.guildId) {
      await interaction.reply({ content: '❌ Nur im Server nutzbar.', ephemeral: true });
      return;
    }

    if (!context.isOwner(interaction.user.id)) {
      await interaction.reply({ content: '❌ Nur Bot Owner dürfen das Bot-Profil ändern.', ephemeral: true });
      return;
    }

    const sub = interaction.options.getSubcommand();

    if (sub === 'show') {
      const { profile } = getBranding(interaction.guildId);
      await interaction.reply({
        content: [
          '🤖 **Bot-Profil (gespeichert)**',
          `Name: ${profile.name}`,
          `Beschreibung: ${profile.description}`,
          `Link: ${profile.inviteLink}`,
          `Footer: ${profile.footer}`,
          `Avatar URL: ${profile.avatarUrl || 'nicht gesetzt'}`,
          `Banner URL: ${profile.bannerUrl || 'nicht gesetzt'}`,
        ].join('\n'),
        ephemeral: true,
      });
      return;
    }

    if (sub === 'set') {
      const next = updateGuildProfile(interaction.guildId, (current) => ({
        ...current,
        name: interaction.options.getString('name') || current.name,
        description: interaction.options.getString('description') || current.description,
        inviteLink: interaction.options.getString('link') || current.inviteLink,
        footer: interaction.options.getString('footer') || current.footer,
        avatarUrl: interaction.options.getString('avatar_url') || current.avatarUrl,
        bannerUrl: interaction.options.getString('banner_url') || current.bannerUrl,
      }));

      await interaction.reply({
        content: `✅ Profil gespeichert. Name: **${next.name}** | Footer: **${next.footer}**`,
        ephemeral: true,
      });
      return;
    }

    if (sub === 'apply') {
      const { profile } = getBranding(interaction.guildId);
      const actions = [];

      try {
        if (profile.name) {
          await interaction.client.user.setUsername(profile.name);
          actions.push('Username gesetzt');
        }
      } catch (error) {
        actions.push(`Username nicht gesetzt (${error.message})`);
      }

      try {
        if (profile.avatarUrl) {
          await interaction.client.user.setAvatar(profile.avatarUrl);
          actions.push('Avatar gesetzt');
        }
      } catch (error) {
        actions.push(`Avatar nicht gesetzt (${error.message})`);
      }

      actions.push('Banner wird in diesem Scaffold nur gespeichert (kein direkter API-Apply integriert).');

      await interaction.reply({ content: `ℹ️ ${actions.join(' | ')}`, ephemeral: true });
    }
  },
};
