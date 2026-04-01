const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Erstellt eine Umfrage')
    .addStringOption((opt) => opt.setName('frage').setDescription('Frage').setRequired(true)),

  async execute(interaction) {
    const frage = interaction.options.getString('frage', true);
    const embed = new EmbedBuilder()
      .setTitle('📊 Umfrage')
      .setDescription(frage)
      .setFooter({ text: 'Made by Apex' })
      .setColor(0x9b59b6);

    await interaction.reply({ embeds: [embed], fetchReply: true });
    const msg = await interaction.fetchReply();
    await msg.react('✅');
    await msg.react('❌');
  },
};
