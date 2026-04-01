const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require('discord.js');
const { DEFAULT_SETTINGS } = require('../services/guildSettingsStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Erstellt GUI-Panels mit Embeds')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) => sub.setName('ticket').setDescription('Sendet das Ticket-Panel'))
    .addSubcommand((sub) => sub.setName('settings').setDescription('Sendet das Settings-GUI-Panel')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'ticket') {
      const embed = new EmbedBuilder()
        .setTitle('🎫 Apex Support Tickets')
        .setDescription('Klicke auf den Button, um ein Ticket zu erstellen.')
        .setFooter({ text: 'Made by Apex' })
        .setColor(0x5865f2);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket:create').setLabel('Ticket erstellen').setStyle(ButtonStyle.Primary),
      );

      await interaction.reply({ embeds: [embed], components: [row] });
      return;
    }

    const options = Object.keys(DEFAULT_SETTINGS.modules).flatMap((name) => [
      {
        label: `${name} aktivieren`,
        description: `Schaltet ${name} an`,
        value: `${name}:on`,
      },
      {
        label: `${name} deaktivieren`,
        description: `Schaltet ${name} aus`,
        value: `${name}:off`,
      },
    ]);

    const embed = new EmbedBuilder()
      .setTitle('⚙️ Settings GUI')
      .setDescription('Wähle im Dropdown direkt die gewünschte Aktion (aktivieren/deaktivieren).')
      .setFooter({ text: 'Made by Apex' })
      .setColor(0x2ecc71);

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('settings:module:select')
        .setPlaceholder('Modul-Aktion auswählen')
        .addOptions(options),
    );

    await interaction.reply({ embeds: [embed], components: [selectRow] });
  },
};
