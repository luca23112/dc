const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Sende einen Vorschlag')
    .addStringOption((opt) => opt.setName('text').setDescription('Vorschlag').setRequired(true)),

  async execute(interaction) {
    const text = interaction.options.getString('text', true);

    const embed = new EmbedBuilder()
      .setTitle('💡 Neuer Vorschlag')
      .setDescription(text)
      .addFields({ name: 'Von', value: `<@${interaction.user.id}>` })
      .setFooter({ text: 'Made by Apex' })
      .setColor(0xf1c40f);

    await interaction.reply({ embeds: [embed], fetchReply: true });
    const message = await interaction.fetchReply();
    await message.react('👍');
    await message.react('👎');
  },
};
