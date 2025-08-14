
import { SlashCommandBuilder } from 'discord.js';
import { prisma } from '../../lib.prisma.js';

export default {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a reminder')
    .addIntegerOption(o=>o.setName('minutes').setDescription('In how many minutes?').setRequired(true))
    .addStringOption(o=>o.setName('message').setDescription('Reminder text').setRequired(true)),
  async execute(interaction) {
    const minutes = interaction.options.getInteger('minutes', true);
    const message = interaction.options.getString('message', true);
    const when = new Date(Date.now() + minutes*60*1000);
    await prisma.reminder.create({
      data: { userId: interaction.user.id, guildId: interaction.guildId ?? null, when, message, channelId: interaction.channelId }
    });
    await interaction.reply({ content: `Okay! I'll remind you in ${minutes} minutes.`, ephemeral: true });
  }
};
