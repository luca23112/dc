const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('event')
    .setDescription('Erstellt ein Event-Embed')
    .addStringOption((opt) => opt.setName('titel').setDescription('Event Titel').setRequired(true))
    .addStringOption((opt) => opt.setName('zeit').setDescription('Zeitpunkt').setRequired(true))
    .addStringOption((opt) => opt.setName('info').setDescription('Zusätzliche Infos').setRequired(false)),

  async execute(interaction) {
    const titel = interaction.options.getString('titel', true);
    const zeit = interaction.options.getString('zeit', true);
    const info = interaction.options.getString('info') || 'Keine weiteren Infos';

    const embed = new EmbedBuilder()
      .setTitle(`📅 ${titel}`)
      .setDescription(`**Zeit:** ${zeit}\n**Info:** ${info}`)
      .setFooter({ text: 'Made by Apex' })
      .setColor(0x1abc9c);

    await interaction.reply({ embeds: [embed] });
  },
};
