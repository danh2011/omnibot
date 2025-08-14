
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('help').setDescription('List commands'),
  async execute(interaction) {
    const cmds = interaction.client.commands;
    const embed = new EmbedBuilder()
      .setTitle('OmniBot Commands')
      .setDescription([...cmds.keys()].map(k => `• \`/${k}\``).join('\n'))
      .setFooter({ text: 'Tip: use /config to set up logging, welcome, etc.' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
