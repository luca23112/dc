const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getBranding } = require('../services/brandingStore');

module.exports = {
  data: new SlashCommandBuilder().setName('about').setDescription('Zeigt Informationen zum Apex Support Bot'),

  async execute(interaction) {
    const guildId = interaction.guildId || 'global';
    const { profile } = getBranding(guildId);

    const embed = new EmbedBuilder()
      .setTitle(profile.name || 'Apex Support Bot')
      .setDescription(`${profile.description}\nLink: ${profile.inviteLink}`)
      .setFooter({ text: profile.footer || 'Made by Apex' })
      .setColor(0x5865f2);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
